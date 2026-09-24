import { useState } from "react"
import type { Page, User } from "../App"
import Navbar from "../components/Navbar"
import type { Item } from "./StorePage"

interface Props {
    navigate: (page: Page) => void
    user: User | null
    cart: Item[]
    updateCartQty: (sku: string, qty: number) => void
    removeFromCart: (sku: string) => void
    logout: () => void
}

type Step = "cart" | "payment" | "confirmed"
// TODO add cash payment method
type PaymentMethod = "card" | "paypal" | "applepay"

function formatCardNumber(value: string) {
    return value.replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim()
}

function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "")
        .slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2)

    return digits
}

function formatCVC(value: string) {
    return value.replace(/\D/g, "")
        .slice(0, 4)
}

const CARD_ICONS: Record<string, string> = {
    visa: "VISA",
    mastercard: "MC",
    amex: "AMEX"
}

function detectCardType(num: string): string {
    const n = num.replace(/\s/g, "")
    if (/^4/.test(n)) return "visa"
    if (/^5[1-5]/.test(n)) return "mastercard"
    if (/^3[47]/.test(n)) return "amex"

    return ""
}

export default function CartPage({
    navigate,
    user,
    cart,
    updateCartQty,
    removeFromCart,
    logout,
}: Props) {

    const [step, setStep] = useState<Step>("cart")
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")

    const [card, setCard] = useState({
        number: "",
        name: "",
        expiry: "",
        cvc: ""
    })
    const [cardErrors, setCardErrors] = useState<Partial<typeof card>>({})

    const [billing, setBilling] = useState({
        email: user?.name ?? "",
        address: "",
        city: "",
        zip: "",
        country: "United States"
    })

    const [billingErrors, setBillingErrors] = useState<Partial<typeof billing>>({})

    const [processingPayment, setProcessingPayment] = useState(false)

    const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0)
    // shipping is free unless cart is less than 200
    const shipping = subtotal > 200 ? 0 : 12
    const total = subtotal + shipping

    const cardType = detectCardType(card.number)

    const validateCard = () => {
        const errs: Partial<typeof card> = {}

        if (card.number.replace(/\s/g, "").length < 13) errs.number = "Enter a valid card number"
        if (!card.name.trim()) errs.name = "Name on card is required"
        if (card.expiry.length < 5) errs.expiry = "Enter a valid expiry"
        if (card.cvc.length < 3) errs.cvc = "Enter a valid CVC"

        return errs
    }

    const validateBilling = () => {
        const errs: Partial<typeof billing> = {}

        if (!billing.email.includes("@")) errs.email = "Enter a valid email"
        if (!billing.address.trim()) errs.address = "Address is required"
        if (!billing.city.trim()) errs.address = "City is required"
        if (!billing.zip.trim()) errs.zip = "Postal code is required"

        return errs
    }

    const handlePay = () => {
        const billingErrors = validateBilling()
        const cardErrors = paymentMethod === "card" ? validateCard() : {}
        setBillingErrors(billingErrors)
        setCardErrors(cardErrors)

        // there are errors with the checked props
        if (Object.keys(billingErrors).length || Object.keys(cardErrors).length) return

        // no error found
        setProcessingPayment(true)
        // simulate processing 
        setTimeout(() => {
            setProcessingPayment(false)
            setStep("confirmed")
        }, 1400)
    }

    const inputBase =
        "w-full px-3 py-2.5 text-sm rounded-lg outline-none transition-all"
    const inputStyle = {
        background: "#0f0e0c",
        border: "1px solid #2a2620",
        color: "#e8e2d4",
    }
    const inputErr = { ...inputStyle, borderColor: "#d46d6d" }

    const setCardField = (k: keyof typeof card, raw: string) => {
        let v = raw
        if (k === "number") v = formatCardNumber(raw)
        if (k === "expiry") v = formatExpiry(raw)
        if (k === "cvc") v = formatCVC(raw)
        setCard((prev) => ({ ...prev, [k]: v }))
        setCardErrors((prev) => ({ ...prev, [k]: undefined }))
    }

    const setBillingField = (k: keyof typeof billing, v: string) => {
        setBilling((prev) => ({ ...prev, [k]: v }))
        setBillingErrors((prev) => ({ ...prev, [k]: undefined }))
    }

    if (step === "confirmed") {
        return (
            <div className="min-h-screen" style={{ background: "#0c0b09" }}>
                <Navbar navigate={navigate} user={user} cart={[]} logout={logout} currentPage="cart" />
                <div className="max-w-2xl mx-auto px-6 py-16">
                    <div
                        className="rounded-2xl p-10 flex flex-col gap-6"
                        style={{ background: "#141210", border: "1px solid #1f1d19" }}
                    >
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ background: "#1a2e1a" }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6db56d" strokeWidth="2.5">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        </div>
                        <div>
                            <p
                                className="mb-1"
                                style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 300, color: "#f2ece0", letterSpacing: "-0.02em" }}
                            >
                                Order confirmed.
                            </p>
                            <p className="text-sm leading-relaxed" style={{ color: "#7a7060" }}>
                                A receipt has been sent to{" "}
                                <span style={{ color: "#9a9080" }}>{billing.email}</span>.
                                Your items will be carefully packed and dispatched within 2 business days.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 pt-4" style={{ borderTop: "1px solid #1f1d19" }}>
                            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "#7a7060" }}>Order summary</p>
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between">
                                    <span className="text-sm" style={{ color: "#9a9080" }}>
                                        {item.name} × {item.qty}
                                    </span>
                                    <span className="text-sm" style={{ color: "#e8c87a" }}>${item.price * item.qty}</span>
                                </div>
                            ))}
                            <div className="flex justify-between pt-3 mt-1" style={{ borderTop: "1px solid #1f1d19" }}>
                                <span className="text-sm font-semibold" style={{ color: "#e8e2d4" }}>Total paid</span>
                                <span style={{ color: "#d4a853", fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 400 }}>${total}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 text-xs mt-2" style={{ color: "#4a4438" }}>
                            <span>Shipped to:</span>
                            <span style={{ color: "#7a7060" }}>{billing.address}, {billing.city}, {billing.zip}</span>
                        </div>

                        <button
                            onClick={() => navigate("store")}
                            className="self-start mt-2 px-6 py-2.5 text-sm font-semibold rounded-lg"
                            style={{ background: "#d4a853", color: "#0c0b09" }}
                        >
                            Continue shopping
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen" style={{ background: "#0c0b09" }}>
            <Navbar navigate={navigate} user={user} cart={cart} logout={logout} currentPage="cart" />

            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header + breadcrumb */}
                <div className="mb-10">
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4a853" }}>Your bag</p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setStep("cart")}
                            className="text-sm transition-colors"
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "1.6rem",
                                fontWeight: 300,
                                color: step === "cart" ? "#f2ece0" : "#4a4438",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Bag
                        </button>
                        <span style={{ color: "#2a2620" }}>›</span>
                        <span
                            className="text-sm"
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "1.6rem",
                                fontWeight: 300,
                                color: step === "payment" ? "#f2ece0" : "#4a4438",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Payment
                        </span>
                    </div>
                </div>

                {/* Empty state */}
                {cart.length === 0 && (
                    <div className="flex flex-col items-start gap-6 pt-4">
                        <p className="text-sm" style={{ color: "#7a7060" }}>
                            You haven't added anything yet.
                        </p>
                        <button
                            onClick={() => navigate("store")}
                            className="px-6 py-2.5 text-sm font-semibold rounded-lg"
                            style={{ background: "#d4a853", color: "#0c0b09" }}
                        >
                            Continue shopping
                        </button>
                    </div>
                )}

                {cart.length > 0 && (
                    <div
                        className="grid gap-10"
                        style={{ gridTemplateColumns: step === "cart" ? "1fr 320px" : "1fr 300px" }}
                    >
                        <div>
                            {/* CART STEP */}
                            {step === "cart" && (
                                <div className="flex flex-col gap-3">
                                    {cart.map((item) => (
                                        <div
                                            key={item.sku}
                                            className="flex gap-4 rounded-xl p-4"
                                            style={{ background: "#141210", border: "1px solid #1f1d19" }}
                                        >
                                            <div
                                                className="rounded-lg overflow-hidden shrink-0"
                                                style={{ width: 80, height: 80, background: "#1c1a16" }}
                                            >
                                                <img src={item.imageLink} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3
                                                        className="text-sm leading-snug"
                                                        style={{ color: "#e8e2d4", fontFamily: "var(--font-display)", fontWeight: 400 }}
                                                    >
                                                        {item.name}
                                                    </h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.sku)}
                                                        style={{ color: "#4a4438", flexShrink: 0 }}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M18 6 6 18M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between mt-3">
                                                    <div
                                                        className="flex items-center rounded-lg overflow-hidden"
                                                        style={{ border: "1px solid #2a2620" }}
                                                    >
                                                        <button
                                                            onClick={() => updateCartQty(item.sku, item.qty - 1)}
                                                            className="w-8 h-8 flex items-center justify-center text-sm"
                                                            style={{ color: "#7a7060" }}
                                                        >−</button>
                                                        <span className="w-8 text-center text-sm" style={{ color: "#e8e2d4" }}>{item.qty}</span>
                                                        <button
                                                            onClick={() => updateCartQty(item.sku, item.qty + 1)}
                                                            className="w-8 h-8 flex items-center justify-center text-sm"
                                                            style={{ color: "#7a7060" }}
                                                        >+</button>
                                                    </div>
                                                    <span className="font-medium text-sm" style={{ color: "#e8c87a" }}>
                                                        ${item.price * item.qty}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => navigate("store")}
                                        className="self-start text-xs mt-2 flex items-center gap-2"
                                        style={{ color: "#7a7060" }}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M19 12H5M12 19l-7-7 7-7" />
                                        </svg>
                                        Continue shopping
                                    </button>
                                </div>
                            )}

                            {/* PAYMENT STEP */}
                            {step === "payment" && (
                                <div className="flex flex-col gap-6">
                                    {/* Contact / Shipping */}
                                    <div
                                        className="rounded-xl p-5"
                                        style={{ background: "#141210", border: "1px solid #1f1d19" }}
                                    >
                                        <p className="text-xs uppercase tracking-wider mb-4" style={{ color: "#7a7060" }}>
                                            Contact & Shipping
                                        </p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="col-span-2">
                                                <label className="block text-xs mb-1.5" style={{ color: "#7a7060" }}>Email</label>
                                                <input
                                                    className={inputBase}
                                                    style={billingErrors.email ? inputErr : inputStyle}
                                                    value={billing.email}
                                                    onChange={(e) => setBillingField("email", e.target.value)}
                                                    placeholder="you@example.com"
                                                    onFocus={(e) => !billingErrors.email && (e.target.style.borderColor = "#d4a853")}
                                                    onBlur={(e) => !billingErrors.email && (e.target.style.borderColor = "#2a2620")}
                                                />
                                                {billingErrors.email && <p className="text-xs mt-1" style={{ color: "#d46d6d" }}>{billingErrors.email}</p>}
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs mb-1.5" style={{ color: "#7a7060" }}>Street address</label>
                                                <input
                                                    className={inputBase}
                                                    style={billingErrors.address ? inputErr : inputStyle}
                                                    value={billing.address}
                                                    onChange={(e) => setBillingField("address", e.target.value)}
                                                    placeholder="12 Rue du Faubourg"
                                                    onFocus={(e) => !billingErrors.address && (e.target.style.borderColor = "#d4a853")}
                                                    onBlur={(e) => !billingErrors.address && (e.target.style.borderColor = "#2a2620")}
                                                />
                                                {billingErrors.address && <p className="text-xs mt-1" style={{ color: "#d46d6d" }}>{billingErrors.address}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs mb-1.5" style={{ color: "#7a7060" }}>City</label>
                                                <input
                                                    className={inputBase}
                                                    style={billingErrors.city ? inputErr : inputStyle}
                                                    value={billing.city}
                                                    onChange={(e) => setBillingField("city", e.target.value)}
                                                    placeholder="Paris"
                                                    onFocus={(e) => !billingErrors.city && (e.target.style.borderColor = "#d4a853")}
                                                    onBlur={(e) => !billingErrors.city && (e.target.style.borderColor = "#2a2620")}
                                                />
                                                {billingErrors.city && <p className="text-xs mt-1" style={{ color: "#d46d6d" }}>{billingErrors.city}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs mb-1.5" style={{ color: "#7a7060" }}>ZIP / Postal</label>
                                                <input
                                                    className={inputBase}
                                                    style={billingErrors.zip ? inputErr : inputStyle}
                                                    value={billing.zip}
                                                    onChange={(e) => setBillingField("zip", e.target.value)}
                                                    placeholder="75001"
                                                    onFocus={(e) => !billingErrors.zip && (e.target.style.borderColor = "#d4a853")}
                                                    onBlur={(e) => !billingErrors.zip && (e.target.style.borderColor = "#2a2620")}
                                                />
                                                {billingErrors.zip && <p className="text-xs mt-1" style={{ color: "#d46d6d" }}>{billingErrors.zip}</p>}
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs mb-1.5" style={{ color: "#7a7060" }}>Country</label>
                                                <select
                                                    className={inputBase}
                                                    style={{ ...inputStyle, cursor: "pointer" }}
                                                    value={billing.country}
                                                    onChange={(e) => setBillingField("country", e.target.value)}
                                                >
                                                    {["United States", "United Kingdom", "France", "Germany", "Italy", "Spain", "Japan", "Australia", "Canada"].map((c) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="rounded-xl p-5"
                                        style={{ background: "#141210", border: "1px solid #1f1d19" }}
                                    >
                                        <p className="text-xs uppercase tracking-wider mb-4" style={{ color: "#7a7060" }}>
                                            Payment method
                                        </p>

                                        <div className="grid grid-cols-3 gap-2 mb-5">
                                            {(["card", "paypal", "applepay"] as PaymentMethod[]).map((m) => (
                                                <button
                                                    key={m}
                                                    onClick={() => setPaymentMethod(m)}
                                                    className="py-2.5 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                                                    style={
                                                        paymentMethod === m
                                                            ? { background: "#2a2620", border: "1px solid #d4a853", color: "#e8e2d4" }
                                                            : { background: "#0f0e0c", border: "1px solid #1f1d19", color: "#7a7060" }
                                                    }
                                                >
                                                    {m === "card" && (
                                                        <>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                                                <line x1="1" y1="10" x2="23" y2="10" />
                                                            </svg>
                                                            Card
                                                        </>
                                                    )}
                                                    {m === "paypal" && (
                                                        <>
                                                            <span style={{ fontWeight: 700, fontSize: "0.75rem", color: paymentMethod === m ? "#6d9ed4" : "#7a7060" }}>
                                                                P
                                                            </span>
                                                            PayPal
                                                        </>
                                                    )}
                                                    {m === "applepay" && (
                                                        <>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.54 4zm-3.1-17.6c-1.42.05-2.6 1.07-3.14 2.22-.48 1.06-.3 2.17.12 2.81 1.49-.05 2.76-1.1 3.27-2.24.49-1.07.28-2.16-.25-2.8z" />
                                                            </svg>
                                                            Pay
                                                        </>
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Card form */}
                                        {paymentMethod === "card" && (
                                            <div className="flex flex-col gap-3">
                                                <div>
                                                    <label className="block text-xs mb-1.5" style={{ color: "#7a7060" }}>Card number</label>
                                                    <div className="relative">
                                                        <input
                                                            className={inputBase}
                                                            style={{
                                                                ...(cardErrors.number ? inputErr : inputStyle),
                                                                paddingRight: cardType ? "4rem" : undefined,
                                                                fontFamily: "monospace",
                                                                letterSpacing: "0.05em",
                                                            }}
                                                            value={card.number}
                                                            onChange={(e) => setCardField("number", e.target.value)}
                                                            placeholder="1234 5678 9012 3456"
                                                            inputMode="numeric"
                                                            onFocus={(e) => !cardErrors.number && (e.target.style.borderColor = "#d4a853")}
                                                            onBlur={(e) => !cardErrors.number && (e.target.style.borderColor = "#2a2620")}
                                                        />
                                                        {cardType && (
                                                            <span
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold"
                                                                style={{ color: cardType === "visa" ? "#6d9ed4" : cardType === "mastercard" ? "#d4a853" : "#9a9080" }}
                                                            >
                                                                {CARD_ICONS[cardType]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {cardErrors.number && <p className="text-xs mt-1" style={{ color: "#d46d6d" }}>{cardErrors.number}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-xs mb-1.5" style={{ color: "#7a7060" }}>Name on card</label>
                                                    <input
                                                        className={inputBase}
                                                        style={cardErrors.name ? inputErr : inputStyle}
                                                        value={card.name}
                                                        onChange={(e) => setCardField("name", e.target.value)}
                                                        placeholder="Elena Marchetti"
                                                        onFocus={(e) => !cardErrors.name && (e.target.style.borderColor = "#d4a853")}
                                                        onBlur={(e) => !cardErrors.name && (e.target.style.borderColor = "#2a2620")}
                                                    />
                                                    {cardErrors.name && <p className="text-xs mt-1" style={{ color: "#d46d6d" }}>{cardErrors.name}</p>}
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs mb-1.5" style={{ color: "#7a7060" }}>Expiry</label>
                                                        <input
                                                            className={inputBase}
                                                            style={{ ...(cardErrors.expiry ? inputErr : inputStyle), fontFamily: "monospace" }}
                                                            value={card.expiry}
                                                            onChange={(e) => setCardField("expiry", e.target.value)}
                                                            placeholder="MM/YY"
                                                            inputMode="numeric"
                                                            onFocus={(e) => !cardErrors.expiry && (e.target.style.borderColor = "#d4a853")}
                                                            onBlur={(e) => !cardErrors.expiry && (e.target.style.borderColor = "#2a2620")}
                                                        />
                                                        {cardErrors.expiry && <p className="text-xs mt-1" style={{ color: "#d46d6d" }}>{cardErrors.expiry}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs mb-1.5" style={{ color: "#7a7060" }}>CVC</label>
                                                        <input
                                                            className={inputBase}
                                                            style={{ ...(cardErrors.cvc ? inputErr : inputStyle), fontFamily: "monospace" }}
                                                            value={card.cvc}
                                                            onChange={(e) => setCardField("cvc", e.target.value)}
                                                            placeholder="•••"
                                                            inputMode="numeric"
                                                            type="password"
                                                            onFocus={(e) => !cardErrors.cvc && (e.target.style.borderColor = "#d4a853")}
                                                            onBlur={(e) => !cardErrors.cvc && (e.target.style.borderColor = "#2a2620")}
                                                        />
                                                        {cardErrors.cvc && <p className="text-xs mt-1" style={{ color: "#d46d6d" }}>{cardErrors.cvc}</p>}
                                                    </div>
                                                </div>

                                                <div
                                                    className="flex items-center gap-2 mt-1 px-3 py-2 rounded-lg text-xs"
                                                    style={{ background: "#0f0e0c", color: "#4a4438" }}
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                    </svg>
                                                    Your card details are encrypted and never stored.
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod === "paypal" && (
                                            <div
                                                className="rounded-lg p-5 flex flex-col items-center gap-3 text-center"
                                                style={{ background: "#0f0e0c", border: "1px solid #1f1d19" }}
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold"
                                                    style={{ background: "#1a2030", color: "#6d9ed4" }}
                                                >
                                                    P
                                                </div>
                                                <p className="text-sm" style={{ color: "#9a9080" }}>
                                                    You'll be redirected to PayPal to complete your payment securely.
                                                </p>
                                                <p className="text-xs" style={{ color: "#4a4438" }}>
                                                    No PayPal account? You can pay with a card through PayPal too.
                                                </p>
                                            </div>
                                        )}

                                        {paymentMethod === "applepay" && (
                                            <div
                                                className="rounded-lg p-5 flex flex-col items-center gap-3 text-center"
                                                style={{ background: "#0f0e0c", border: "1px solid #1f1d19" }}
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                                    style={{ background: "#1f1d19" }}
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#e8e2d4">
                                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.54 4zm-3.1-17.6c-1.42.05-2.6 1.07-3.14 2.22-.48 1.06-.3 2.17.12 2.81 1.49-.05 2.76-1.1 3.27-2.24.49-1.07.28-2.16-.25-2.8z" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm" style={{ color: "#9a9080" }}>
                                                    Use Face ID or Touch ID to pay instantly with Apple Pay.
                                                </p>
                                                <p className="text-xs" style={{ color: "#4a4438" }}>
                                                    Available on Safari on iPhone, iPad, and Mac.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* total panel */}
                        <div
                            className="rounded-xl p-6 h-fit sticky top-6"
                            style={{ background: "#141210", border: "1px solid #1f1d19" }}
                        >
                            <p className="text-xs uppercase tracking-wider mb-5" style={{ color: "#7a7060" }}>Order summary</p>

                            <div className="flex flex-col gap-3 mb-5">
                                {cart.map((item) => (
                                    <div key={item.sku} className="flex gap-3 items-center">
                                        <div
                                            className="rounded overflow-hidden shrink-0"
                                            style={{ width: 36, height: 36, background: "#1c1a16" }}
                                        >
                                            <img src={item.imageLink} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="flex-1 text-xs leading-snug" style={{ color: "#9a9080" }}>
                                            {item.name}
                                            {item.qty > 1 && <span style={{ color: "#4a4438" }}> ×{item.qty}</span>}
                                        </span>
                                        <span className="text-xs" style={{ color: "#e8e2d4" }}>${item.price * item.qty}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-2 pt-4 mb-5" style={{ borderTop: "1px solid #1f1d19" }}>
                                <div className="flex justify-between text-sm">
                                    <span style={{ color: "#7a7060" }}>Subtotal</span>
                                    <span style={{ color: "#e8e2d4" }}>${subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span style={{ color: "#7a7060" }}>Shipping</span>
                                    <span style={{ color: shipping === 0 ? "#6db56d" : "#e8e2d4" }}>
                                        {shipping === 0 ? "Free" : `$${shipping}`}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-xs mt-0.5" style={{ color: "#3a3630" }}>Free over $200</p>
                                )}
                            </div>

                            <div className="flex justify-between py-3 mb-5" style={{ borderTop: "1px solid #1f1d19" }}>
                                <span className="text-sm font-semibold" style={{ color: "#e8e2d4" }}>Total</span>
                                <span style={{ color: "#d4a853", fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 400 }}>
                                    ${total}
                                </span>
                            </div>

                            {step === "cart" ? (
                                <button
                                    onClick={() => setStep("payment")}
                                    className="w-full py-3 text-sm font-semibold rounded-lg"
                                    style={{ background: "#d4a853", color: "#0c0b09" }}
                                >
                                    Proceed to payment
                                </button>
                            ) : (
                                <button
                                    onClick={handlePay}
                                    disabled={processingPayment}
                                    className="w-full py-3 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                                    style={{
                                        background: processingPayment ? "#2a2620" : "#d4a853",
                                        color: processingPayment ? "#7a7060" : "#0c0b09",
                                    }}
                                >
                                    {processingPayment ? (
                                        <>
                                            <span
                                                className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                                                style={{ borderColor: "#7a7060", borderTopColor: "transparent" }} />
                                            Processing… {" "}
                                        </>
                                    ) : (
                                        <>
                                            {paymentMethod === "card" && `Pay $${total}`}
                                            {paymentMethod === "paypal" && `Continue to PayPal`}
                                            {paymentMethod === "applepay" && `Pay with Apple Pay`}
                                        </>
                                    )}
                                </button>
                            )}

                            <p className="text-xs text-center mt-4" style={{ color: "#3a3630" }}>
                                Secure checkout · Free returns within 30 days
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

}

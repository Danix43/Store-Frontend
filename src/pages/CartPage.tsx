import { useState } from "react"
import type { CartItem } from "../App"

interface Props {
    navigate: (page: Page) => void
    user: User | null
    cart: CartItem[]
    updateCartQty: (id: number, qty: number) => void
    removeFromCart: (id: number) => void
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
}

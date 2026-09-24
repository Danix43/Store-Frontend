import { useState } from "react"
import type { Page, User } from "../App"
import Navbar from "../components/Navbar"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createItemQueryOptions } from "../api/Utilities"
import { Categories, type Item } from "./StorePage"

interface Props {
    navigate: (page: Page) => void
    user: User | null
    cart: Item[]
    logout: () => void
}


// TODO add support for collections for products in orders
const testOrders = [
    {
        id: "#Store-ORD1",
        customer: "Customer 1",
        products: "Item 1, Item 2",
        status: "Delivered",
        amount: 100,
        date: "Sep 22, 2026",
    },
    {
        id: "#Store-ORD2",
        customer: "Customer 2",
        products: "Item 1",
        status: "Delivered",
        amount: 100,
        date: "Sep 22, 2026",
    },
    {
        id: "#Store-ORD3",
        customer: "Customer 3",
        products: "Item 2",
        status: "Delivered",
        amount: 100,
        date: "Sep 22, 2026",
    }, {
        id: "#Store-ORD4",
        customer: "Customer 4",
        products: "Item4",
        status: "Delivered",
        amount: 100,
        date: "Sep 22, 2026",
    }
]

const weeklyRevenue = [42, 68, 55, 82, 97, 74, 110]
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sun", "Sun"]
const categories = Categories


const statusStyle: Record<string, { bg: string, color: string }> = {
    Delivered: { bg: "#1a2e1a", color: "#6db56d" },
    Shipped: { bg: "#1a2030", color: "#6d9ed4" },
    Processing: { bg: "#2e2218", color: "#d4a853" },
}

function EditModal({
    product,
    onSave,
    onDelete,
    onClose,
}: {
    product: Item,
    onSave: (p: Item) => void,
    onDelete: (sku: string) => void,
    onClose: () => void
}) {

    const [form, setForm] = useState<Item>({ ...product })
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [saved, setSaved] = useState(false)

    const set = <K extends keyof Item>(k: K, v: Item[K]) => setForm((prev) => ({ ...prev, [k]: v }))

    const handleSave = () => {
        onSave(form)
        setSaved(true)
        setTimeout(() => {
            setSaved(false)
            onClose()
        }, 700)
    }

    const inputCls =
        "w-full px-3 py-2 text-sm rounded-lg outline-none transition-all"
    const inputStyle = {
        background: "#0f0e0c",
        border: "1px solid #2a2620",
        color: "#e8e2d4",
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.75)" }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div
                className="w-full max-w-lg rounded-xl overflow-hidden"
                style={{ background: "#141210", border: "1px solid #2a2620" }}
            >
                {/* Modal header */}
                <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom: "1px solid #1f1d19" }}
                >
                    <div>
                        <p
                            className="text-xs uppercase tracking-widest mb-0.5"
                            style={{ color: "#d4a853" }}
                        >
                            Edit Product
                        </p>
                        <p className="text-sm font-medium" style={{ color: "#e8e2d4" }}>
                            {product.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-lg leading-none transition-colors"
                        style={{ color: "#7a7060" }}
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <div
                    className="px-6 py-5 flex flex-col gap-4 overflow-y-auto"
                    style={{ maxHeight: "65vh" }}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label
                                className="block text-xs uppercase tracking-wider mb-1.5"
                                style={{ color: "#7a7060" }}
                            >
                                Product Name
                            </label>
                            <input
                                className={inputCls}
                                style={inputStyle}
                                value={form.name}
                                onChange={(e) => set("name", e.target.value)}
                                onFocus={(e) => (e.target.style.borderColor = "#d4a853")}
                                onBlur={(e) => (e.target.style.borderColor = "#2a2620")}
                            />
                        </div>

                        <div>
                            <label
                                className="block text-xs uppercase tracking-wider mb-1.5"
                                style={{ color: "#7a7060" }}
                            >
                                SKU
                            </label>
                            <input
                                className={inputCls}
                                style={{
                                    ...inputStyle,
                                    color: "#d4a853",
                                    fontFamily: "monospace",
                                }}
                                value={form.sku}
                                onChange={(e) => set("sku", e.target.value)}
                                onFocus={(e) => (e.target.style.borderColor = "#d4a853")}
                                onBlur={(e) => (e.target.style.borderColor = "#2a2620")}
                            />
                        </div>

                        <div>
                            <label
                                className="block text-xs uppercase tracking-wider mb-1.5"
                                style={{ color: "#7a7060" }}
                            >
                                Category
                            </label>
                            <select
                                className={inputCls}
                                style={{ ...inputStyle, cursor: "pointer" }}
                                value={form.category}
                                onChange={(e) => set("category", e.target.value)}
                            >
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                className="block text-xs uppercase tracking-wider mb-1.5"
                                style={{ color: "#7a7060" }}
                            >
                                Price ($)
                            </label>
                            <input
                                type="number"
                                min={0}
                                className={inputCls}
                                style={inputStyle}
                                value={form.price}
                                onChange={(e) => set("price", Number(e.target.value))}
                                onFocus={(e) => (e.target.style.borderColor = "#d4a853")}
                                onBlur={(e) => (e.target.style.borderColor = "#2a2620")}
                            />
                        </div>

                        <div>
                            <label
                                className="block text-xs uppercase tracking-wider mb-1.5"
                                style={{ color: "#7a7060" }}
                            >
                                Stock
                            </label>
                            <input
                                type="number"
                                min={0}
                                className={inputCls}
                                style={inputStyle}
                                value={form.qty}
                                onChange={(e) => set("qty", Number(e.target.value))}
                                onFocus={(e) => (e.target.style.borderColor = "#d4a853")}
                                onBlur={(e) => (e.target.style.borderColor = "#2a2620")}
                            />
                        </div>

                    </div>
                </div>

                {/* Footer actions */}
                <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ borderTop: "1px solid #1f1d19" }}
                >
                    {confirmDelete ? (
                        <div className="flex items-center gap-3">
                            <span className="text-xs" style={{ color: "#d46d6d" }}>
                                Delete permanently?
                            </span>
                            <button
                                onClick={() => {
                                    onDelete(product.sku)
                                    onClose()
                                }}
                                className="px-3 py-1.5 text-xs rounded font-semibold"
                                style={{ background: "#3d1a1a", color: "#d46d6d" }}
                            >
                                Confirm delete
                            </button>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="text-xs"
                                style={{ color: "#7a7060" }}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="text-xs transition-colors"
                            style={{ color: "#7a7060" }}
                        >
                            Delete product
                        </button>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded-lg transition-colors"
                            style={{ border: "1px solid #2a2620", color: "#7a7060" }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-5 py-2 text-sm rounded-lg font-semibold transition-all"
                            style={{
                                background: saved ? "#2a3d2a" : "#d4a853",
                                color: saved ? "#6db56d" : "#0c0b09",
                            }}
                        >
                            {saved ? "Saved ✓" : "Save changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function DashboardPage({ navigate, user, cart, logout }: Props) {
    const [activeTab, setActiveTab] =
        useState<"overview" | "orders" | "products">("overview")

    // data handling
    const { data } = useSuspenseQuery(createItemQueryOptions())
    const [products, setProducts] = useState<Item[]>(data)

    const [editing, setEditing] = useState<Item | null>(null)

    const maxRevenue = Math.max(...weeklyRevenue)

    const handleSave = (updated: Item) => {
        setProducts((prev) =>
            prev.map((p) => (p.sku === updated.sku ? updated : p)),
        )
    }

    const handleDelete = (sku: string) => {
        setProducts((prev) => prev.filter((p) => p.sku !== sku))
    }

    const handleAddNew = () => {
        const newProduct: Item = {
            sku: `NEW-${Date.now().toString().slice(-4)}`,
            name: "New Product",
            category: "Home",
            price: 0,
            qty: 0,
            imageLink: "sample link"
        }
        setProducts((prev) => [newProduct, ...prev])
        setEditing(newProduct)
    }

    if (!user) {
        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center gap-4"
                style={{ background: "#0c0b09" }}
            >
                <p style={{ color: "#9a9080" }}>
                    You must be signed in to view the dashboard.
                </p>
                <button
                    onClick={() => navigate("login")}
                    className="px-6 py-2 rounded text-sm font-semibold"
                    style={{ background: "#d4a853", color: "#0c0b09" }}
                >
                    Sign in
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen" style={{ background: "#0c0b09" }}>
            <Navbar
                navigate={navigate}
                user={user}
                cart={cart}
                logout={logout}
                currentPage="dashboard"
            />

            {editing && (
                <EditModal
                    product={editing}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    onClose={() => setEditing(null)}
                />
            )}

            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-10">
                    <p
                        className="text-xs uppercase tracking-widest mb-2"
                        style={{ color: "#d4a853" }}
                    >
                        Dashboard
                    </p>
                    <h1
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "2.5rem",
                            fontWeight: 300,
                            color: "#f2ece0",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Welcome back, {user.name.split(" ")[0]}.
                    </h1>
                </div>

                {/* Stat cards */}
                <div
                    className="grid grid-cols-2 gap-4 mb-8"
                    style={{
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    }}
                >
                    {[
                        { label: "Revenue (Sept)", value: "$12,480", delta: "+18%" },
                        { label: "Orders", value: "184", delta: "+12%" },
                        { label: "Avg. Order Value", value: "$132", delta: "+4%" },
                        {
                            label: "Active Products",
                            value: String(products.length),
                            delta: "",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="p-5 rounded-lg"
                            style={{ background: "#141210", border: "1px solid #1f1d19" }}
                        >
                            <p
                                className="text-xs uppercase tracking-wider mb-3"
                                style={{ color: "#7a7060" }}
                            >
                                {stat.label}
                            </p>
                            <div className="flex items-end justify-between">
                                <span
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "2rem",
                                        fontWeight: 300,
                                        color: "#f2ece0",
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    {stat.value}
                                </span>
                                {stat.delta && (
                                    <span
                                        className="text-xs font-semibold mb-1"
                                        style={{ color: "#6db56d" }}
                                    >
                                        {stat.delta}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div
                    className="flex gap-6 mb-8"
                    style={{ borderBottom: "1px solid #1f1d19" }}
                >
                    {(["overview", "orders", "products"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="pb-3 text-sm capitalize transition-colors"
                            style={{
                                color: activeTab === tab ? "#d4a853" : "#7a7060",
                                borderBottom:
                                    activeTab === tab
                                        ? "1px solid #d4a853"
                                        : "1px solid transparent",
                                fontWeight: activeTab === tab ? 500 : 400,
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === "overview" && (
                    <div
                        className="grid gap-6"
                        style={{ gridTemplateColumns: "1fr 300px" }}
                    >
                        <div
                            className="p-6 rounded-lg"
                            style={{ background: "#141210", border: "1px solid #1f1d19" }}
                        >
                            <p
                                className="text-xs uppercase tracking-wider mb-6"
                                style={{ color: "#7a7060" }}
                            >
                                Weekly Revenue
                            </p>
                            <div className="flex items-end gap-3 h-40">
                                {weeklyRevenue.map((val, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 flex flex-col items-center gap-2"
                                    >
                                        <div
                                            className="w-full rounded-t transition-all"
                                            style={{
                                                height: `${(val / maxRevenue) * 140}px`,
                                                background: i === 6 ? "#d4a853" : "#2a2620",
                                                minHeight: "8px",
                                            }}
                                        />
                                        <span className="text-xs" style={{ color: "#4a4438" }}>
                                            {days[i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            className="p-6 rounded-lg"
                            style={{ background: "#141210", border: "1px solid #1f1d19" }}
                        >
                            <p
                                className="text-xs uppercase tracking-wider mb-6"
                                style={{ color: "#7a7060" }}
                            >
                                Top Products
                            </p>
                            <div className="flex flex-col gap-4">
                                {[
                                    { name: "Item1", sales: 42 },
                                    { name: "Item2", sales: 38 },
                                    { name: "Item3", sales: 61 },
                                    { name: "Item4", sales: 29 },
                                ].map((p) => (
                                    <div key={p.name}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm" style={{ color: "#e8e2d4" }}>
                                                {p.name}
                                            </span>
                                            <span className="text-xs" style={{ color: "#7a7060" }}>
                                                {p.sales} sold
                                            </span>
                                        </div>
                                        <div
                                            className="w-full h-1 rounded-full"
                                            style={{ background: "#1f1d19" }}
                                        >
                                            <div
                                                className="h-1 rounded-full"
                                                style={{
                                                    width: `${(p.sales / 61) * 100}%`,
                                                    background: "#d4a853",
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div
                        className="rounded-lg overflow-hidden"
                        style={{ border: "1px solid #1f1d19" }}
                    >
                        <table className="w-full text-sm">
                            <thead>
                                <tr
                                    style={{
                                        background: "#141210",
                                        borderBottom: "1px solid #1f1d19",
                                    }}
                                >
                                    {[
                                        "Order",
                                        "Customer",
                                        "Product",
                                        "Date",
                                        "Amount",
                                        "Status",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left px-5 py-3 text-xs uppercase tracking-wider"
                                            style={{ color: "#7a7060", fontWeight: 500 }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {testOrders.map((order, i) => (
                                    <tr
                                        key={order.id}
                                        style={{
                                            background: i % 2 === 0 ? "#0f0e0c" : "#141210",
                                            borderBottom: "1px solid #1a1814",
                                        }}
                                    >
                                        <td
                                            className="px-5 py-3.5"
                                            style={{
                                                color: "#d4a853",
                                                fontFamily: "monospace",
                                                fontSize: "0.8rem",
                                            }}
                                        >
                                            {order.id}
                                        </td>
                                        <td className="px-5 py-3.5" style={{ color: "#e8e2d4" }}>
                                            {order.customer}
                                        </td>
                                        <td className="px-5 py-3.5" style={{ color: "#9a9080" }}>
                                            {order.products}
                                        </td>
                                        <td className="px-5 py-3.5" style={{ color: "#7a7060" }}>
                                            {order.date}
                                        </td>
                                        <td
                                            className="px-5 py-3.5"
                                            style={{ color: "#e8e2d4", fontWeight: 500 }}
                                        >
                                            ${order.amount}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span
                                                className="px-2.5 py-0.5 text-xs font-semibold rounded-full"
                                                style={statusStyle[order.status]}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "products" && (
                    <>
                        {/* Products toolbar */}
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-sm" style={{ color: "#7a7060" }}>
                                {products.length} products
                            </p>
                            <button
                                onClick={handleAddNew}
                                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-semibold transition-all"
                                style={{ background: "#d4a853", color: "#0c0b09" }}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                Add product
                            </button>
                        </div>

                        {/* Products table */}
                        <div
                            className="rounded-lg overflow-hidden"
                            style={{ border: "1px solid #1f1d19" }}
                        >
                            <table className="w-full text-sm">
                                <thead>
                                    <tr
                                        style={{
                                            background: "#141210",
                                            borderBottom: "1px solid #1f1d19",
                                        }}
                                    >
                                        {[
                                            "SKU",
                                            "Name",
                                            "Category",
                                            "Price",
                                            "Stock",
                                            "",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="text-left px-5 py-3 text-xs uppercase tracking-wider"
                                                style={{ color: "#7a7060", fontWeight: 500 }}
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p, i) => (
                                        <tr
                                            key={p.sku}
                                            className="group transition-colors"
                                            style={{
                                                background: i % 2 === 0 ? "#0f0e0c" : "#141210",
                                                borderBottom: "1px solid #1a1814",
                                            }}
                                        >
                                            <td
                                                className="px-5 py-3.5"
                                                style={{
                                                    color: "#d4a853",
                                                    fontFamily: "monospace",
                                                    fontSize: "0.8rem",
                                                }}
                                            >
                                                {p.sku}
                                            </td>
                                            <td
                                                className="px-5 py-3.5 font-medium"
                                                style={{ color: "#e8e2d4" }}
                                            >
                                                {p.name}
                                            </td>
                                            <td className="px-5 py-3.5" style={{ color: "#9a9080" }}>
                                                {p.category}
                                            </td>
                                            <td
                                                className="px-5 py-3.5"
                                                style={{ color: "#e8c87a", fontWeight: 500 }}
                                            >
                                                ${p.price}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span
                                                    style={{
                                                        color: p.qty <= 5 ? "#d46d6d" : "#7a7060",
                                                    }}
                                                >
                                                    {/* FIXME fix this nested conditional */}
                                                    {p.qty <= 5 && p.qty > 0
                                                        ? `⚠ ${p.qty}`
                                                        : p.qty === 0
                                                            ? "Out of stock"
                                                            : p.qty}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <button
                                                    onClick={() => setEditing(p)}
                                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded transition-all opacity-0 group-hover:opacity-100"
                                                    style={{
                                                        border: "1px solid #2a2620",
                                                        color: "#9a9080",
                                                    }}
                                                >
                                                    <svg
                                                        width="11"
                                                        height="11"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    )

}

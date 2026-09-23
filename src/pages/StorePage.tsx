import { useState } from "react"
import type { CartItem, Page, User } from "../App"
import Navbar from "../components/Navbar"

interface Props {
    navigate: (p: Page) => void
    user: User | null
    cart: CartItem[]
    addToCart: (item: Omit<CartItem, "qty">) => void
    logout: () => void
}

const testProds = [
    {
        id: 1,
        name: "Item1",
        category: "Category 1",
        price: 90,
        image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600&h=700&fit=crop&auto=format",
        tag: "Tag 1"
    },
]

const categories = [
    "Category 1",
    "Category 2",
    "Category 3",
]

export default function StorePage({
    navigate,
    user,
    cart,
    addToCart,
    logout,
}: Props) {

    const [activeCategory, setActiveCategory] = useState("All")
    const [addedIds, setAddedIds] = useState<number[]>([])

    const filtered =
        activeCategory === "All"
            ? testProds
            : testProds.filter((p) => p.category === activeCategory)

    const handleAdd = (product: typeof testProds[0]) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        })
        setAddedIds((prev) => [...prev, product.id])
        setTimeout(() => setAddedIds((prev) => prev.filter((id) => id !== product.id)), 1500)
    }

    return (
        <div className="min-h-screen"
            style={{
                background: "#0c0b09"
            }}>
            <Navbar
                navigate={navigate}
                user={user}
                cart={cart}
                logout={logout}
                currentPage="store">
            </Navbar>

            <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
                <div className="grid grid-cols-1 gap-4"
                    style={{
                        gridTemplateColumns: "minmax(0, 1fr) auto"
                    }}>

                    <div>
                        <p className="text-xs uppercase tracking-widest mb-4"
                            style={{
                                color: "#d4a853",
                                fontWeight: 500
                            }}>
                            Colection 1
                        </p>

                        <h1 className="leading-none"
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(3rem, 7vw, 6rem)",
                                fontWeight: 300,
                                color: "#f2ece0",
                                letterSpacing: "-.03em",
                            }}
                        >
                            Products worth
                            <br />
                            <em style={{ fontStyle: "italic", color: "#d4a853" }}>
                                having
                            </em>
                        </h1>
                    </div>
                    <div className="hidden md:flex items-end pb-2">
                        <p
                            className="text-sm max-w-56 text-right leading-relaxed"
                            style={{
                                color: "#7a7060"
                            }}>
                            Text for the content
                        </p>
                    </div>
                </div>
            </section>

            {/* Category filter bar */}
            <div className="max-w-7xl mx-auto px-6 pb-10">
                <div className="flex gap-2 flex-wrap">
                    {categories.map((cat) => (
                        <button key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className="px-4 py-1.5 text-sm rounded-full transition-all"
                            style={
                                activeCategory === cat
                                    ? {
                                        background: "#d4a853",
                                        color: "#0c0b09",
                                        fontWeight: 600
                                    }
                                    : {
                                        border: "1px solid #2a2620",
                                        color: "#7a7060"
                                    }}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Produts grid */}
            <main className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid gap-6"
                    style={{
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))"
                    }}>
                    {filtered.map((product) => (
                        <article
                            key={product.id}
                            className="group"
                            style={{
                                background: "#141210",
                                borderRadius: "8px",
                                overflow: "hidden",
                                border: "1px solid #1f1d19"
                            }}
                        >
                            <div
                                className="relative overflow-hidden"
                                style={{
                                    height: "320px",
                                    background: "#1c1a16"
                                }}
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className=" w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {product.tag && (
                                    <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-semibold rounded"
                                        style={{
                                            background: "#d4a853",
                                            color: "#0c0b09"
                                        }}
                                    >
                                        {product.tag}
                                    </span>
                                )}
                            </div>

                            <div className="p-4">
                                <p
                                    className="text-xs uppercase tracking-wider mb-1"
                                    style={{
                                        color: "#7a7060"
                                    }}>
                                    {product.category}
                                </p>

                                <h3 className="font-medium mb-3"
                                    style={{
                                        color: "#e8e2d4",
                                        fontFamily: "var(--font-display)",
                                        fontSize: "1rem",
                                        fontWeight: 400
                                    }}>
                                    {product.name}
                                </h3>

                                <div className="flex items-center justify-between">
                                    <span
                                        style={{
                                            color: "#e8c87a",
                                            fontWeight: 500,
                                            fontSize: "1.05rem",
                                        }}>
                                        {product.price}
                                    </span>

                                    <button
                                        onClick={() => handleAdd(product)}
                                        className="text-xs px-4 py-2 rounded transition-all font-medium"
                                        style={
                                            addedIds.includes(product.id)
                                                ? { background: "#2a3d2a", color: "#6db56d" }
                                                : {
                                                    background: "#1c1a16",
                                                    border: "1px solid #2a2620",
                                                    color: "#e8e2d4"
                                                }}>
                                        {addedIds.includes(product.id) ? "Added to cart" : "Add to cart"}
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main >

            {/* footer bar */}
            <footer
                style={{
                    borderTop: "1px solid #1f1d19"
                }}>

                <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                    <span
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "#e8c87a",
                            fontWeight: 600,
                        }}>
                        Shop
                    </span>
                </div>
            </footer>
        </div >
    )

}


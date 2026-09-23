import type { CartItem, Page, User } from "../App"

interface NavbarProps {
    navigate: (p: Page) => void
    user: User | null
    cart: CartItem[]
    logout: () => void
    currentPage: Page
}

export default function Navbar({
    navigate,
    user,
    cart,
    logout,
    currentPage
}: NavbarProps) {
    const totalQty = cart.reduce((s, cartItem) => s + cartItem.qty, 0)

    return (
        <header style={{ borderBottom: "1px solid #2a2620" }}>
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <button
                    onClick={() => navigate("store")}
                    className="cursor-pointer"
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "#e8c87a",
                        letterSpacing: "-.02em"
                    }}>
                    Store
                </button>

                <nav className="flex items-center gap-8">
                    <button
                        onClick={() => navigate("store")}
                        className="text-sm transition-colors"
                        style={{
                            color: currentPage == "store" ? "#e8c87a" : "#9a9080",
                            fontWeight: 500,
                        }}>
                        Shop
                    </button>

                    {user && (
                        <button
                            onClick={() => navigate("dashboard")}
                            className="text-sm transition-colors"
                            style={{
                                color: currentPage == "store" ? "#e8c87a" : "#9a9080",
                                fontWeight: 500,
                            }}>
                            Dashboard
                        </button>
                    )}
                </nav>

                <div className="flex items-center gap-4">
                    <button className="relative text-sm transition-colors"
                        style={{ color: "#9a9080" }}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        ><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>

                        {totalQty > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center text-xs font-semibold rounded-full"
                                style={{
                                    background: "#d4a853",
                                    color: "#0c0b09",
                                    fontSize: "0.6rem",
                                }}
                            >
                                {totalQty}
                            </span>
                        )}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm"
                                style={{
                                    color: "#9a9080"
                                }}
                            >
                                {user.name}
                            </span>

                            <button onClick={logout}
                                className="text-sm px-3 py-1.5 rounded transition-colors"
                                style={{
                                    border: "1px solid #2a2620",
                                    color: "#9a9080"
                                }}
                            >
                                Log out
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button onClick={() => navigate("register")}
                                className="text-sm px-4 py-1.5 rounded transition-all"
                                style={{
                                    background: "#d4a853",
                                    color: "#0c0b09",
                                    fontWeight: 600
                                }}>
                                Register
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
} 

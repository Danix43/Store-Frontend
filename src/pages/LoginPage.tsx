import { useState, type SyntheticEvent } from "react"
import type { Page, User } from "../App"

interface Props {
    navigate: (page: Page) => void
    setUser: (user: User) => void
}

export default function LoginPage({
    navigate,
    setUser
}: Props) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault()

        setError("")

        // form checking
        if (!email || !password) {
            setError("Fill in all the forms")
        }

        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            // for ui testing, set the name from the email
            setUser({
                name: email.split("@")[0]
                    .replace(".", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase()),
                email
            })
            navigate("store")
        }, 800)
    }

    return (
        <div className="min-h-screen flex"
            style={{
                background: "#0c0b09"
            }}>

            {/* left side */}
            <div
                className="hidden lg:block flex-1 relative overflow-hidden"
                style={{
                    background: "#141210"
                }}>

                <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&h=1200&fit=crop&auto=format"
                    alt="Sample"
                    className="w-full h-full object-cover opacity-60"
                />

                <div className="absolute inset-0"
                    style={{
                        background: "linear-gradient(to right, transparent, #0c0b09)"
                    }}>
                </div>

                <div className="absolute bottom-12 left-12">

                    <span style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        color: "#e8c87a",
                    }}>
                        Store
                    </span>

                    <p
                        className="mt-2 text-sm max-w-xs leading-relaxed"
                        style={{ color: "#7a7060" }}
                    >
                        This is an another sample text, idk what to put here too
                    </p>

                </div>

            </div>

            {/* right side - login form */}
            <div className="flex-1 flex items-center justify-center px-8">
                <div className="w-full max-w-sm">
                    <button
                        onClick={() => navigate("store")}
                        className="text-xs mb-10 flex items-center gap-2 transition-colors"
                        style={{ color: "#7a7060" }}
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to store
                    </button>

                    <p
                        className="text-xs uppercase tracking-widest mb-4"
                        style={{ color: "#d4a853" }}
                    >
                        Welcome back
                    </p>

                    <h1
                        className="mb-8"
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "2.25rem",
                            fontWeight: 300,
                            color: "#f2ece0",
                            letterSpacing: "-0.02em",
                        }}>
                        Sign in to <br /> your account
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4">

                        <div>
                            <label
                                className="block text-xs uppercase tracking-wider mb-2"
                                style={{ color: "#7a7060" }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 text-sm rounded-lg outline-none transition-all"
                                style={{
                                    background: "#1c1a16",
                                    border: "1px solid #2a2620",
                                    color: "#e8e2d4",
                                }}
                                onFocus={e => (e.target.style.borderColor = "#d4a853")}
                                onBlur={e => (e.target.style.borderColor = "#2a2620")}
                            />
                        </div>

                        <div>
                            <label
                                className="block text-xs uppercase tracking-wider mb-2"
                                style={{ color: "#7a7060" }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={email}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="...................."
                                className="w-full px-4 py-3 text-sm rounded-lg outline-none transition-all"
                                style={{
                                    background: "#1c1a16",
                                    border: "1px solid #2a2620",
                                    color: "#e8e2d4",
                                }}
                                onFocus={e => (e.target.style.borderColor = "#d4a853")}
                                onBlur={e => (e.target.style.borderColor = "#2a2620")}
                            />
                        </div>

                        {error && (
                            <p className="text-xs"
                                style={{ color: "#d46d6d" }}>
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 py-3 rounded-lg text-sm font-semibold transition-opacity"
                            style={{
                                background: "#d4a853",
                                color: "#0c0b09",
                                opacity: loading ? 0.6 : 1,
                            }}>
                            Log in
                        </button>

                    </form>

                    <p className="mt-6 text-sm text-center"
                        style={{ color: "#7a7060" }}>
                        New here{" "}

                        <button
                            onClick={() => navigate("register")}
                            className="transition-colors"
                            style={{ color: "#d4a853" }}>
                            Create an account
                        </button>

                    </p>

                </div>

            </div>

        </div>
    )

}
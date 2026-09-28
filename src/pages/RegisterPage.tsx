import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react"
import type { Page, User } from "../App"
import { sendRegisterRequest } from "../api/Utilities"

interface Props {
    navigate: (page: Page) => void
    setUser: (user: User) => void
}

export default function RegisterPage({ navigate, setUser }: Props) {
    const [form, setForm] = useState({ name: "", email: "", password: "", passConfirm: "" })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [k]: e.target.value }))

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault()

        setError("")

        // form input checking 
        // TODO uncomment the returns, used now for faster login
        if (!form.name || !form.email || !form.password) {
            setError("Fill all the fields in the form")
            // return
        }

        if (form.password !== form.passConfirm) {
            setError("The passwords do not match")
            // return
        }

        if (form.password.length < 6) {
            setError("The password must be as least 6 characters")
            // return
        }

        setLoading(true)

        // send request to create account
        const newUser = {
            name: form.name,
            email: form.email,
            password: form.password
        }

        sendRegisterRequest(newUser)
            .then((response) => {
                console.log(`token got: ${response.token}`);
                localStorage.setItem("apiToken", response.token)
            })
        console.log(`token in localStorage: ${localStorage.getItem("apiToken")}`);

        setTimeout(() => {
            setLoading(false)
            setUser({ name: form.name, email: form.email, password: form.password })
            navigate("store")
        }, 800)
    }

    const inputStyle = {
        background: "#1c1a16",
        border: "1px solid #2a2620",
        color: "#e8e2d4",
    }


    return (
        <div className="min-h-screen flex" style={{ background: '#0c0b09' }}>
            {/* Left side of the screen */}
            <div className="hidden lg:block flex-1 relative overflow-hidden" style={{ background: '#141210' }}>
                <img
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&h=1200&fit=crop&auto=format"
                    alt="Products"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, #0c0b09)' }} />
                <div className="absolute bottom-12 left-12">
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: '#e8c87a' }}>
                        Store
                    </span>
                    <p className="mt-2 text-sm max-w-xs leading-relaxed" style={{ color: '#7a7060' }}>
                        This is a sample text, idk to put here
                    </p>
                </div>
            </div>

            {/* Right side of the screen */}
            <div className="flex-1 flex items-center justify-center px-8 py-12">
                <div className="w-full max-w-sm">
                    <button
                        onClick={() => navigate('store')}
                        className="text-xs mb-10 flex items-center gap-2"
                        style={{ color: '#7a7060' }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to store
                    </button>

                    <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#d4a853' }}>New account</p>
                    <h1
                        className="mb-8"
                        style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 300, color: '#f2ece0', letterSpacing: '-0.02em' }}
                    >
                        Join<br />
                        <em style={{ fontStyle: 'italic', color: '#d4a853' }}>Store</em>
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {[
                            { label: 'Full name', key: 'name' as const, type: 'text', placeholder: 'Your name' },
                            { label: 'Email', key: 'email' as const, type: 'email', placeholder: 'you@example.com' },
                            { label: 'Password', key: 'password' as const, type: 'password', placeholder: '6+ characters' },
                            { label: 'Confirm password', key: 'passConfirm' as const, type: 'password', placeholder: '••••••••' },
                        ].map(field => (
                            <div key={field.key}>
                                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#7a7060' }}>
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    value={form[field.key]}
                                    onChange={set(field.key)}
                                    placeholder={field.placeholder}
                                    className="w-full px-4 py-3 text-sm rounded-lg outline-none transition-all"
                                    style={inputStyle}
                                    onFocus={e => (e.target.style.borderColor = '#d4a853')}
                                    onBlur={e => (e.target.style.borderColor = '#2a2620')}
                                />
                            </div>
                        ))}

                        {error && <p className="text-xs" style={{ color: '#d46d6d' }}>{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 py-3 rounded-lg text-sm font-semibold transition-opacity"
                            style={{ background: '#d4a853', color: '#0c0b09', opacity: loading ? 0.6 : 1 }}
                        >
                            {loading ? 'Creating account…' : 'Create account'}
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-center" style={{ color: '#7a7060' }}>
                        Already have an account?{' '}
                        <button onClick={() => navigate('login')} style={{ color: '#d4a853' }}>
                            Log in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )

}


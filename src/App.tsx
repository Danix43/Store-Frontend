import { useState } from 'react'
import StorePage from './pages/StorePage'
import RegisterPage from './pages/RegisterPage'

export type Page = 'store' | 'dashboard' | 'login' | 'register'

export interface User {
    name: string
    email: string
}

export interface CartItem {
    id: number
    name: string
    price: number
    qty: number
    image: string
}


export default function App() {
    const [page, setPage] = useState<Page>("store")
    const [user, setUser] = useState<User | null>(null)
    const [cart, setCart] = useState<CartItem[]>([])

    const navigate = (p: Page) => setPage(p)

    const addToCart = (item: Omit<CartItem, "qty">) => {
        setCart(prev => {
            const existing = prev.some(cartItem => cartItem.id === item.id)
            if (existing) return prev.map(cartItem => cartItem.id === item.id ? {
                ...cartItem, qty: cartItem.qty + 1
            } : cartItem)
            return [...prev, { ...item, qty: 1 }]
        })
    }

    const logout = () => {
        setUser(null)
        setPage("store")
    }

    const props = {
        navigate,
        user,
        setUser,
        cart,
        addToCart,
        logout
    }

    return (
        <div className="min-h-screen"
            style={{
                background: "#0c0b09"
            }}>
            {page === "store" && <StorePage {...props} />}
            {page === "dashboard" && <DashboardPage {...props} />}
            {page === "login" && <LoginPage {...props} />}
            {page === "register" && <RegisterPage {...props} />}
        </div>
    )
}


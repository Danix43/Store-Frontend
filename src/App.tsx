import { useState } from 'react'
import StorePage, { type Item } from './pages/StorePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CartPage from './pages/CartPage'

export type Page = "store" | "dashboard" | "login" | "register" | "cart"

export interface User {
    name: string
    email: string
}


export default function App() {
    const [page, setPage] = useState<Page>("store")
    const [user, setUser] = useState<User | null>(null)
    const [cart, setCart] = useState<Item[]>([])

    const navigate = (p: Page) => setPage(p)

    const addToCart = (item: Omit<Item, "qty">) => {
        setCart(prev => {
            const existing = prev.some(cartItem => cartItem.sku === item.sku)
            if (existing) return prev.map(cartItem => cartItem.sku === item.sku ? {
                ...cartItem, qty: cartItem.qty + 1
            } : cartItem)
            return [...prev, { ...item, qty: 1 }]
        })
    }

    const updateCartQty = (sku: string, qty: number) => {
        if (qty <= 0) {
            setCart(prev => prev.filter(c => c.sku !== sku))
        }
        else {
            setCart(prev => prev.map(c => c.sku === sku ? { ...c, qty } : c))
        }
    }

    const removeFromCart = (sku: string) => setCart(prev => prev.filter(c => c.sku !== sku))

    const logout = () => {
        setUser(null)
        setPage("store")
    }

    const props = {
        navigate, user, setUser, cart, addToCart, updateCartQty, removeFromCart, logout
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
            {page === "cart" && <CartPage {...props} />}
        </div>
    )
}


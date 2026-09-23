import { useState } from 'react'
import Navbar from './components/Navbar'

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


function App() {

    return (
        <>
            <Navbar navigate={""}
                user={""}
                cart={""}
                logout={""}
                currentPage="store">
            </Navbar>
        </>
    )
}

export default App

import axios from "axios";

export const api = axios.create({
    // TODO replace hardcoded url
    // baseURL: import.meta.env.STORE_BACKEND_URL,
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },

    // 10 seconds for timeout
    timeout: 10000,
});

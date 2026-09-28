import { queryOptions } from "@tanstack/react-query";
import axios, { type AxiosInstance } from "axios";
import initialItemData from "../assets/itemsTestData.json"
import ordersTestData from "../assets/ordersTestData.json"
import type { User } from "../App";

function makeAxiosInstance(): AxiosInstance {
    const authToken = localStorage.getItem("apiToken")
    const instance = axios.create(
        {
            // baseURL: import.meta.env.STORE_BACKEND_URL,
            baseURL: "http://localhost:8080/api",
            headers: {
                "Content-Type": "application/json",
            },

            // 10 seconds for timeout
            timeout: 10000,
        }
    )
    if (authToken !== null) {
        // token not null, add to request
        instance.interceptors.request.use((config) => {
            config.headers.set("Authorization", `Bearer ${authToken}`)
            return config
        })
    }

    return instance
};


async function fetchAllItems() {
    const axiosInstance = makeAxiosInstance()

    const { data } = await axiosInstance.get("/items/all")
    console.log(`items retrieved ${data}`);

    return data;
}

export function createItemQueryOptions() {
    return queryOptions(
        {
            queryKey: ["allItems"],
            queryFn: fetchAllItems,
            initialData: initialItemData
        }
    )
}

export function createOrdersQueryOptions() {
    return queryOptions({
        queryKey: ["allOrders"],
        queryFn: getAllOrders,
        initialData: ordersTestData
    })
}

async function getAllOrders() {
    const axiosInstance = makeAxiosInstance();

    const { data } = (await axiosInstance.get("/orders/all"));

    return data;
}

export async function sendNewOrder(payload: Object) {
    const axiosInstance = makeAxiosInstance()

    const response = await axiosInstance.post("/orders/newOrder", payload)
    console.log(`Response for POST new order: ${response.data}`);
}

export async function sentNewItem(payload: Object) {
    const axiosInstance = makeAxiosInstance();
    const { status } = await axiosInstance.post("/items/newItem", payload)
    console.log(`Request for saving new item returned ${status}`);
}

export async function sendRegisterRequest(payload: User) {
    const axiosInstance = makeAxiosInstance();

    const { data, status } = await axiosInstance.post("/auth/register", payload)

    console.log(`request to register user status: ${status}`);
    console.log(`request to register user data: ${data}`);

    return data;
}

export async function sendLoginRequest(payload: any) {
    const axiosInstance = makeAxiosInstance()

    const { data } = await axiosInstance.post("/auth/login", payload)

    return data
}


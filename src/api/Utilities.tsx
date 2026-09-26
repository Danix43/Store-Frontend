import { queryOptions } from "@tanstack/react-query";
import axios, { type AxiosInstance } from "axios";
import initialItemData from "../assets/itemsTestData.json"
import ordersTestData from "../assets/ordersTestData.json"

function makeAxiosInstance(): AxiosInstance {
    return axios.create(
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
    const request = axios.create(
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

    const response = await request.post("/orders/newOrder", payload)
    console.log(`Response for POST new order: ${response.data}`);
}

export async function sentNewItem(payload: Object) {
    const axiosInstance = makeAxiosInstance();
    const { status } = await axiosInstance.post("/items/newItem", payload)
    console.log(`Request for saving new item returned ${status}`);
}

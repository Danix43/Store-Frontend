import { queryOptions } from "@tanstack/react-query";
import axios, { type AxiosInstance } from "axios";
import initialItemData from "../assets/itemsTestData.json"
import ordersTestData from "../assets/ordersTestData.json"

// TODO remove or fix the requests made by axios
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
    const response = await fetch("http://localhost:8080/api/items/all")

    return await response.json()
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

    console.log(data);

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


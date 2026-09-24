import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import initialItemData from "../assets/itemsTestData.json"

// TODO remove or fix the requests made by axios
async function requestAllItems() {
    const request = axios.create(
        {
            baseURL: import.meta.env.STORE_BACKEND_URL,
            // baseURL: "http://localhost:8080/api",
            headers: {
                "Content-Type": "application/json",
            },

            // 10 seconds for timeout
            timeout: 10000,
        }
    )

    const { data } = await request.get("/items/all")
    console.log(data);
    return data
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



"use client"; // Enables client-side interactivity

import { useState, useEffect } from "react";
import axios from "axios";

export default function FormPage() {
    const [data, setData] = useState("test");

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("/api/example");

                if (response.status === 200) {
                    console.log(response);
                    setData(response.data)
                } else {
                    console.log(`Error: ${response.data.error}`);
                }
            } catch (error: any) {
                console.log(error.response?.data?.error || "An unexpected error occurred.");
            }
        }

        fetchData();
    }, [])

    return (
        <div>
            {JSON.stringify(data)}
        </div>
    );
}

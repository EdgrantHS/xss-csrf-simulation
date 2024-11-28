
"use client"; // Enables client-side interactivity

import { useState } from "react";
import axios from "axios";

export default function FormPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await axios.post("/api/submit", { title, content });

            if (response.status === 200) {
                setMessage("Data submitted successfully!");
                setTitle("");
                setContent("");
            } else {
                setMessage(`Error: ${response.data.error}`);
            }
        } catch (error: any) {
            setMessage(error.response?.data?.error || "An unexpected error occurred.");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Submit a Post</h1>
            <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="title" style={{ display: "block", marginBottom: "0.5rem" }}>
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: "100%", padding: "0.5rem" }}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="content" style={{ display: "block", marginBottom: "0.5rem" }}>
                        Content
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        style={{ width: "100%", padding: "0.5rem", height: "100px" }}
                    />
                </div>
                <button type="submit" style={{ padding: "0.5rem 1rem" }}>
                    Submit
                </button>
            </form>
            {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
        </div>
    );
}


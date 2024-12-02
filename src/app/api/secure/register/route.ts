import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Reusable CORS handler
async function handleWithCors(req: Request, handler: (req: Request) => Promise<NextResponse>) {
    const origin = req.headers.get("origin");
    const allowedOrigins = ["https://kemjar34.vercel.app"];

    if (!origin || !allowedOrigins.includes(origin)) {
        return NextResponse.json(
            { error: "CORS policy: Access denied" },
            { status: 403 }
        );
    }

    if (req.method === "OPTIONS") {
        return new NextResponse(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    }

    return handler(req);
}

// POST handler - Register user
export async function POST(request: Request) {
    return handleWithCors(request, async (req) => {
        try {
            const { username, password } = await req.json();

            // Validate input
            if (!username || !password) {
                return NextResponse.json(
                    { error: "Username and Password are required" },
                    { status: 400 }
                );
            }

            const client = await clientPromise;
            const db = client.db("Kemjar");
            const collection = db.collection("Users");

            // Check if the username already exists
            const existingUser = await collection.findOne({ username });
            if (existingUser) {
                return NextResponse.json(
                    { error: "Username already exists" },
                    { status: 400 }
                );
            }

            // Add new user to the database
            await collection.insertOne({ username, password });

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: "Failed to register user" },
                { status: 500 }
            );
        }
    });
}

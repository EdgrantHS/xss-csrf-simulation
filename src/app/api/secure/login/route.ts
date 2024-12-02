import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Middleware wrapper
async function handleWithCors(req: Request, handler: (req: Request) => Promise<NextResponse>) {
    const origin = req.headers.get("origin");
    const allowedOrigins = ["https://kemjar34.vercel.app"];
    // const allowedOrigins = ["http://localhost:3000"];

    if (!origin || !allowedOrigins.includes(origin)) {
        return NextResponse.json(
            { error: "CORS policy: Access denied" },
            { status: 403 }
        );
    }

    // Preflight (OPTIONS) requests
    if (req.method === "OPTIONS") {
        return new NextResponse(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    }

    // Run the actual handler
    return handler(req);
}

// POST handler
export async function POST(request: Request) {
    return handleWithCors(request, async (req) => {
        try {
            const { username, password } = await req.json();
            if (!username || !password) {
                return NextResponse.json(
                    { error: "Username and Password is Required" },
                    { status: 400 }
                );
            }

            const client = await clientPromise;
            const db = client.db("Kemjar");
            const collection = db.collection("Users");

            const user = await collection.findOne({ username });
            if (!user || user.password !== password) {
                return NextResponse.json(
                    { error: "Invalid Username or Password" },
                    { status: 401 }
                );
            }

            const sessionToken =
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);

            const sessionCollection = db.collection("Session");
            await sessionCollection.insertOne({ username, sessionToken });

            return NextResponse.json({
                success: true,
                sessionToken,
                username,
            });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: "Failed to Login" },
                { status: 500 }
            );
        }
    });
}

// GET handler
export async function GET(request: Request) {
    return handleWithCors(request, async () => {
        try {
            const client = await clientPromise;
            const db = client.db("Kemjar");
            const collection = db.collection("Users");

            const users = await collection.find().toArray();
            return NextResponse.json(users);
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: "Failed to get users" },
                { status: 500 }
            );
        }
    });
}

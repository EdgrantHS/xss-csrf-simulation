import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Reusable CORS handler
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

    if (req.method === "OPTIONS") {
        return new NextResponse(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    }

    return handler(req);
}

// POST handler - Create new session
export async function POST(request: Request) {
    return handleWithCors(request, async (req) => {
        try {
            const { username } = await req.json();
            if (!username) {
                return NextResponse.json(
                    { error: "Username is Required" },
                    { status: 400 }
                );
            }

            const client = await clientPromise;
            const db = client.db("Kemjar");
            const collection = db.collection("Session");

            const sessionToken =
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);

            await collection.insertOne({ username, sessionToken });

            return NextResponse.json({ success: true, sessionToken });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: "Failed to Create new session" },
                { status: 500 }
            );
        }
    });
}

// GET handler - Retrieve username from session
export async function GET(request: Request) {
    return handleWithCors(request, async (req) => {
        try {
            const client = await clientPromise;
            const db = client.db("Kemjar");
            const collection = db.collection("Session");

            const { searchParams } = new URL(req.url);
            const session = searchParams.get("session");

            if (session) {
                const sessionToken = await collection.findOne({ sessionToken: session });
                if (!sessionToken) {
                    return NextResponse.json(
                        { error: "Session not found" },
                        { status: 404 }
                    );
                }

                return NextResponse.json({ username: sessionToken.username });
            }

            return NextResponse.json(
                { error: "Session is Required" },
                { status: 400 }
            );
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: "Failed to retrieve session" },
                { status: 500 }
            );
        }
    });
}

// DELETE handler - Remove session
export async function DELETE(request: Request) {
    return handleWithCors(request, async (req) => {
        try {
            const { session } = await req.json();
            if (!session) {
                return NextResponse.json(
                    { error: "Session is Required" },
                    { status: 400 }
                );
            }

            const client = await clientPromise;
            const db = client.db("Kemjar");
            const collection = db.collection("Session");

            await collection.deleteOne({ sessionToken: session });

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: "Failed to delete session" },
                { status: 500 }
            );
        }
    });
}

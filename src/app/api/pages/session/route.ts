import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
    // add new session
    try {
        const { username } = await request.json(); // Parse the body
        if (!username) {
            return NextResponse.json(
                { error: "Username is Required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("Kemjar");
        const collection = db.collection("Session");

        const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        await collection.insertOne ({ username, sessionToken });

        return NextResponse.json({ success: true, sessionToken });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to Create new session" },
            { status: 500 }
        );
    }
}

// get username from session
export async function GET(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("Kemjar");
        const collection = db.collection("Session");

        // Parse query parameters from the URL
        const { searchParams } = new URL(request.url);
        const session = searchParams.get("session"); // Extract 'session' query parameter

        if (session) {
            // Search for a specific session by sessionToken
            const sessionToken = await collection .findOne({ sessionToken: session });
                
            if (!sessionToken) {
                return NextResponse.json(
                    { error: "Session not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({ username: sessionToken.username });
        }

        return NextResponse.json(
            // Return all session
            await collection.find().toArray()
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to retrieve session" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { session } = await request.json(); // Parse the body
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
}
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
    try {
        const { title, content } = await request.json(); 
        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("Kemjar");
        const collection = db.collection("Kemjar");

        const result = await collection.insertOne({ title, content });

        return NextResponse.json({ success: true, id: result.insertedId });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to save data" },
            { status: 500 }
        );
    }
}

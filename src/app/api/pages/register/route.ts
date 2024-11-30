import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json(); // Parse the body
        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and Password is Required" },
                { status: 400 }
            );
        }

        //TODO: Hash the password before posting to the database

        const client = await clientPromise;
        const db = client.db("Kemjar");
        const collection = db.collection("Users");

        // Mengecek apakah user dengan username yang sama sudah ada
        const user = await collection
            .findOne({ username });
        if (user) {
            return NextResponse.json(
                { error: "Username already exists" },
                { status: 400 }
            );
        }

        // Menambahkan user baru ke database
        await collection.insertOne({ username, password });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to Register" },
            // detailed error message for debugging
            // { error: error.message },
            { status: 500 }
        );
    }
}

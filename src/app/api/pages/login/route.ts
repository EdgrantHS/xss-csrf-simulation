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

        //TODO: Hash the password before querying the database

        const client = await clientPromise;
        const db = client.db("Kemjar");
        const collection = db.collection("Users");

        // Mendapat user dengan username yang sesuai
        const user = await collection.findOne({ username });

        // Mengecek apakah password yang dimasukkan sesuai
        if (!user || user.password !== password) {
            return NextResponse.json(
                { error: "Invalid Username or Password" },
                { status: 401 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to Login" },
            { status: 500 }
        );
    }
}

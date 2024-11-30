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

        // Generate session token (This is just an example, you can modify it based on your requirement)
        const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Save session to the database
        const sessionCollection = db.collection("Session");
        await sessionCollection.insertOne({ username, sessionToken });

        // Return sessionToken and username in the response
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
}

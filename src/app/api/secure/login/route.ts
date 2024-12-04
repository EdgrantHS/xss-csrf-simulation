import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import crypto  from 'crypto';

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

        let csrfToken = '';

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

        if (username == "admin") {
            csrfToken = crypto.randomBytes(32).toString('hex');
        } else {
            csrfToken = "";
        }

        // Return sessionToken and username in the response
        return NextResponse.json({
            success: true,
            sessionToken,
            csrfToken,
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

//get all users
export async function GET( request: Request) {
    try {
        // get parameter from URL
        const { searchParams } = new URL(request.url);

        //if searchParams has session
        const session = searchParams.get("session");

        // get usernmae from session from /api/secure/session
        console.log("AAAAAAAA "+session);
        // const sessionResponse = await fetch("http://localhost:3000/api/secure/session?session=" + session);
        const sessionResponse = await fetch("https://kemjar34.vercel.app/api/secure/session?session=" + session);
        const sessionData = await sessionResponse.json();
        const username = sessionData.username;

        //if username is admin, return all users
        if (username !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

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
}
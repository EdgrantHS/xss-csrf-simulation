import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import crypto from "crypto";

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
    const collection = db.collection("Users");

    const csrfToken = crypto.randomBytes(32).toString("hex");

    const response = await collection.updateOne(
      { username }, // Find the user by their username
      { $set: { csrfToken } } // Set the csrfToken field
    );
    console.log(response);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to Create new csrf token" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Kemjar");
    // Koleksi untuk sesi dan pengguna
    const sessionCollection = db.collection("Sessions");
    const userCollection = db.collection("Users");

    // Ambil sessionToken dari cookie
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get("session")?.value;
    console.log(sessionToken);
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cari sesi berdasarkan sessionToken
    const session = await sessionCollection.findOne({ sessionToken });
    if (!session || !session.username) {
      return NextResponse.json(
        { error: "Session not found or invalid" },
        { status: 401 }
      );
    }

    // Cari pengguna berdasarkan username dari sesi
    const user = await userCollection.findOne({ username: session.username });
    if (!user || !user.csrfToken) {
      return NextResponse.json(
        { error: "CSRF token not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ csrfToken: user.csrfToken });
  } catch (error) {
    console.error("Failed to retrieve CSRF token:", error);
    return NextResponse.json(
      { error: "Failed to retrieve CSRF token" },
      { status: 500 }
    );
  }
}

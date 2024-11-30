import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
    // add new blog
    try {
        const { title, body } = await request.json(); // Parse the body
        if (!title || !body) {
            return NextResponse.json(
                { error: "Title and Body is Required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("Kemjar");
        const collection = db.collection("Blogs");

        // Mencari apakah blog dengan judul yang sama sudah ada
        const checkTitle = await collection.findOne({ title });

        // Jika sudah ada blog dengan judul yang sama
        if (checkTitle) {
            return NextResponse.json(
                { error: "Blog already exists" },
                { status: 400 }
            );
        }

        // Menambahkan blog baru ke database
        await collection.insertOne({ title, body });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to Create new Blog" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("Kemjar");
        const collection = db.collection("Blogs");

        // Parse query parameters from the URL
        const { searchParams } = new URL(request.url);
        const title = searchParams.get("title"); // Extract 'title' query parameter

        if (title) {
            // Search for a specific blog by title
            const blog = await collection.findOne({ title });

            if (!blog) {
                return NextResponse.json(
                    { error: "Blog not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({ success: true, blog });
        }

        // If no specific title is provided, return all blogs
        const blogs = await collection.find({}).sort({ _id: -1 }).toArray();

        return NextResponse.json({
            success: true,
            count: blogs.length,
            blogs,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to retrieve blogs" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { title, body } = await request.json(); // Parse the body
        if (!title || !body) {
            return NextResponse.json(
                { error: "Title and Body is Required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("Kemjar");
        const collection = db.collection("Blogs");

        // Mencari apakah blog dengan judul yang sama sudah ada
        const checkTitle = await collection.findOne({ title });

        // Jika tidak ada blog dengan judul yang sama
        if (!checkTitle) {
            return NextResponse.json(
                { error: "Blog not found" },
                { status: 404 }
            );
        }

        // Update blog
        await collection.updateOne({ title }, { $set: { body } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update blog" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { title } = await request.json(); // Parse the body
        if (!title) {
            return NextResponse.json(
                { error: "Title is Required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("Kemjar");
        const collection = db.collection("Blogs");

        // Mencari apakah blog dengan judul yang sama sudah ada
        const checkTitle = await collection.findOne({ title });

        // Jika tidak ada blog dengan judul yang sama
        if (!checkTitle) {
            return NextResponse.json(
                { error: "Blog not found" },
                { status: 404 }
            );
        }

        // Delete blog
        await collection.deleteOne({ title });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete blog" },
            { status: 500 }
        );
    }
}
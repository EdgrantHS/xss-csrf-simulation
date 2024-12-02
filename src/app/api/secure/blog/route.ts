import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Reusable CORS middleware
async function handleWithCors(req: Request, handler: (req: Request) => Promise<NextResponse>) {
    const origin = req.headers.get("origin");
    const allowedOrigins = ["https://kemjar34.vercel.app"];

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
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    }

    return handler(req);
}

// POST handler - Add new blog
export async function POST(request: Request) {
    return handleWithCors(request, async (req) => {
        try {
            const { title, body } = await req.json();
            if (!title || !body) {
                return NextResponse.json(
                    { error: "Title and Body are required" },
                    { status: 400 }
                );
            }

            const client = await clientPromise;
            const db = client.db("Kemjar");
            const collection = db.collection("Blogs");

            const checkTitle = await collection.findOne({ title });
            if (checkTitle) {
                return NextResponse.json(
                    { error: "Blog already exists" },
                    { status: 400 }
                );
            }

            await collection.insertOne({ title, body });

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: "Failed to create new blog" },
                { status: 500 }
            );
        }
    });
}

// GET handler - Retrieve blogs
export async function GET(request: Request) {
    return handleWithCors(request, async (req) => {
        try {
            const client = await clientPromise;
            const db = client.db("Kemjar");
            const collection = db.collection("Blogs");

            const { searchParams } = new URL(req.url);
            const title = searchParams.get("title");

            if (title) {
                const blog = await collection.findOne({ title });
                if (!blog) {
                    return NextResponse.json(
                        { error: "Blog not found" },
                        { status: 404 }
                    );
                }

                return NextResponse.json({ success: true, blog });
            }

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
    });
}

// PUT handler - Update blog
export async function PUT(request: Request) {
    return handleWithCors(request, async (req) => {
        try {
            const { title, body } = await req.json();
            if (!title || !body) {
                return NextResponse.json(
                    { error: "Title and Body are required" },
                    { status: 400 }
                );
            }

            const client = await clientPromise;
            const db = client.db("Kemjar");
            const collection = db.collection("Blogs");

            const checkTitle = await collection.findOne({ title });
            if (!checkTitle) {
                return NextResponse.json(
                    { error: "Blog not found" },
                    { status: 404 }
                );
            }

            await collection.updateOne({ title }, { $set: { body } });

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: "Failed to update blog" },
                { status: 500 }
            );
        }
    });
}

// DELETE handler - Delete blog
export async function DELETE(request: Request) {
    return handleWithCors(request, async (req) => {
        try {
            const { title } = await req.json();
            if (!title) {
                return NextResponse.json(
                    { error: "Title is required" },
                    { status: 400 }
                );
            }

            const client = await clientPromise;
            const db = client.db("Kemjar");
            const collection = db.collection("Blogs");

            const checkTitle = await collection.findOne({ title });
            if (!checkTitle) {
                return NextResponse.json(
                    { error: "Blog not found" },
                    { status: 404 }
                );
            }

            await collection.deleteOne({ title });

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: "Failed to delete blog" },
                { status: 500 }
            );
        }
    });
}

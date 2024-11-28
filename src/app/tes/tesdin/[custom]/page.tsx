'use client'

import { useParams } from 'next/navigation';

export default function BlogPost() {
    const { custom } = useParams();

    return (
        <div>
            <h1>Blog Post: {custom}</h1>
            <p>This is a dynamic route for the blog post "{custom}".</p>
        </div>
    );
}

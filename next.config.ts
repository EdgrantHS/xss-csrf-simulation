import type { NextConfig } from "next";

const allowedOrigins = ["https://kemjar34.vercel.app"]; // Add other allowed origins if necessary
// const allowedOrigins = ["http://localhost:3000"]; // Add other allowed origins if necessary

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: allowedOrigins.join(","), // Allows only the specified origins
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS, PUT, DELETE", // Allow specific methods
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization", // Allow specific headers
          },
        ],
      },
    ];
  },
};

export default nextConfig;

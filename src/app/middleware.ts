import { NextApiRequest, NextApiResponse } from "next";

// const allowedOrigins = ["https://kemjar34.vercel.app"];
const allowedOrigins = ["http://localhost:3000"];

export function corsMiddleware(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const origin = req.headers.origin || "";

  if (!allowedOrigins.includes(origin)) {
    res.status(403).json({ message: "CORS policy: Access denied" });
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(204).end(); // Handle preflight requests
    return;
  }

  next();
}

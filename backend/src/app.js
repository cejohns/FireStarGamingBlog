// backend/src/app.js
// @ts-check

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import newsRoutes from "./routes/newsRoutes.js"; // <-- your new route

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SINGLE app instance
const app = express();

// Core middleware
app.use(express.json());

// API routes
app.use("/api/gaming-news", newsRoutes);

// Serve static frontend (if you want one-process dev)
app.use(express.static(path.join(__dirname, "../../frontend/public")));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

export default app;

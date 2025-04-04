import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

// CORS — open for now (secure later)
import cors from "cors";
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
}));

// MongoDB
import connectDB from './config/db.js';
connectDB();

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
import authRoutes from "./routes/authRoutes.js";
import musicRoutes from "./routes/musicRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import analyticRoutes from "./routes/analyticRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";

// ✅ API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/music", musicRoutes);
app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/analytics", analyticRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/artist", artistRoutes);

// ✅ Error handling for unknown API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API Route not found" });
  }
  next();
});

// ✅ Handle Next.js app in production
if (process.env.NODE_ENV === "production") {
  const next = (await import("next")).default;
  const nextApp = next({ dev: false, dir: path.join(__dirname, "../frontend") });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();

  // 🔁 Forward everything else to Next.js
  app.all("*", (req, res) => handle(req, res));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server + Next.js running in production on port ${PORT}`)
  );
} else {
  // In development: run Express only (Next runs via its own dev server)
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Backend running in dev mode on port ${PORT}`)
  );
}

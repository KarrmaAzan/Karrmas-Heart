// ✅ Load .env EARLY before anything else
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure .env loads from root
dotenv.config({ path: path.resolve(__dirname, "./.env") });

// ✅ Validate STRIPE_SECRET_KEY early
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is missing from your .env file.");
  process.exit(1);
}
console.log("🔑 Stripe Key:", process.env.STRIPE_SECRET_KEY);

import express from "express";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
// import cors from "cors";

// Connect MongoDB
import connectDB from "./config/db.js";
connectDB();

const app = express();

// Security Middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // CORS (open for now; lock down later)
// app.use(cors({
//   origin: true,
//   credentials: true,
// }));

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import musicRoutes from "./routes/musicRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import analyticRoutes from "./routes/analyticRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/music", musicRoutes);
app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/analytics", analyticRoutes);
// app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/artist", artistRoutes);

// API 404 fallback
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }
  next();
});

// NEXT.JS SSR - ONLY IN PRODUCTION
if (process.env.NODE_ENV === "production") {
  const next = (await import("next")).default;
  const nextApp = next({ dev: false, dir: path.join(__dirname, "../frontend") });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();

  app.use(express.static(path.join(__dirname, "../frontend/.next")));
  app.use(express.static(path.join(__dirname, "../frontend/public")));

  app.all("*", (req, res) => handle(req, res));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server + Next.js running in production on port ${PORT}`);
  });
} else {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Backend running in dev mode on port ${PORT}`);
  });
}

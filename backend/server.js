// ✅ Load .env from /backend (your actual root for backend stuff)
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env from this folder (backend)
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
import cors from "cors";

// Connect MongoDB
import connectDB from "./config/db.js";
connectDB();

const app = express();

// ✅ Trust proxy (IMPORTANT for CORS + rate-limiter on Render)
app.set('trust proxy', 1);

// ✅ Security & parsing middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000
}));

const allowedOrigins = [
  "http://localhost:3000", // dev
  "https://karrmas-heart.vercel.app" // prod
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow tools like Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("❌ Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
import authRoutes from "./routes/authRoutes.js";
import musicRoutes from "./routes/musicRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import analyticRoutes from "./routes/analyticRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";

const registerRoutes = () => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/music", musicRoutes);
  app.use("/api/v1/albums", albumRoutes);
  app.use("/api/v1/playlists", playlistRoutes);
  app.use("/api/v1/search", searchRoutes);
  app.use("/api/v1/analytics", analyticRoutes);
  app.use("/api/v1/payment", paymentRoutes);
  console.log("✅ Registering /api/v1/artist");
  app.use("/api/v1/artist", artistRoutes);

  // ✅ Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "UP" });
  });
};

// ✅ Register all routes
registerRoutes();

// ✅ API 404 fallback
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }
  next();
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend API running on port ${PORT}`);
});

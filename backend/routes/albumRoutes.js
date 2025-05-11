import express from "express";
import {
  createAlbum,
  getAlbums,
  getAlbumById,
} from "../controllers/albumController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Temp upload folder for Cloudinary
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

const router = express.Router();

// Upload new album with cover and tracks
router.post(
  "/",
  protect,
  admin,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "tracks", maxCount: 50 },
  ]),
  createAlbum
);

// Get all albums
router.get("/", getAlbums);

// Get album by ID
router.get("/:id", getAlbumById);

export default router;

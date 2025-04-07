import Artist from '../models/Artist.js';
import Music from '../models/Music.js';
import path from 'path';
import fs from 'fs';

const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://karrmas-heart.onrender.com"
  : "http://localhost:5000";


// 📄 controllers/artistController.js


export const registerArtist = async (req, res) => {
  try {
    const { name, bio, image } = req.body;

    // Priority:
    // 1. Uploaded image (req.file)
    // 2. Provided Cloudinary URL
    // 3. Fallback default image
    const finalImage = req.file
      ? `/uploads/${req.file.filename}`
      : image?.startsWith("http")
        ? image
        : "/uploads/default-artist.jpg";

    const newArtist = new Artist({ name, bio, image: finalImage });
    await newArtist.save();

    res.status(201).json({ message: "Artist registered", artist: newArtist });
  } catch (error) {
    console.error("Error registering artist:", error);
    res.status(500).json({ message: "Failed to register artist", error: error.message });
  }
};


// GET Artist Page (for Artist.jsx)
export const getArtistPage = async (req, res) => {
  console.log("✅ [API] GET /api/v1/artist");

  // Dynamically build correct BASE_URL for prod or dev
  const getBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;

  try {
    const artist = await Artist.findOne().lean();

    if (!artist) {
      console.log("❌ No artist found.");
      return res.status(404).json({ message: "Artist not found." });
    }

    // Normalize image URL
    const imageUrl = artist.image?.includes("http")
      ? artist.image
      : `${getBaseUrl(req)}${artist.image}`;

    // Get all songs and top 5
    const allSongs = await Music.find({ artist: artist._id }).lean();
    const topSongs = await Music.find({ artist: artist._id })
      .sort({ playCount: -1 })
      .limit(5)
      .lean();

    // Attach artist name directly so frontend doesn’t get ID
    const attachArtistName = (songs) =>
      songs.map((song) => ({
        ...song,
        artist: artist.name,
      }));

    const responsePayload = {
      artist: { ...artist, image: imageUrl },
      topSongs: attachArtistName(topSongs),
      allSongs: attachArtistName(allSongs),
    };

    // 🔍 Log the full response payload
    console.log("🎯 Artist Page Response:", JSON.stringify(responsePayload, null, 2));

    res.status(200).json(responsePayload);
  } catch (error) {
    console.error("🔥 Error fetching artist page:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// PUT Update Artist Image
export const updateArtistImage = async (req, res) => {
  try {
    const artist = await Artist.findOne();
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    if (artist.image && artist.image !== `${BASE_URL}/uploads/default-artist.jpg`) {
      const oldImagePath = path.join(
        path.resolve(),
        "uploads",
        path.basename(artist.image)
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    artist.image = `${BASE_URL}/uploads/${req.file.filename}`;
    await artist.save();

    res.json({ message: "Artist image updated", imageUrl: artist.image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

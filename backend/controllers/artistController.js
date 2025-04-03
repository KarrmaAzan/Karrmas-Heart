const Artist = require('../models/Artist');
const Music = require('../models/Music');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || "http://localhost:5000"; // Ensuring BASE_URL consistency

// Register a new artist
const registerArtist = async (req, res) => {
  try {
    const { name, bio } = req.body;
    let image = "/uploads/default-artist.jpg"; // default fallback

    if (req.file) {
      image = req.file.path || req.file.secure_url;
    }

    const existingArtist = await Artist.findOne({ name });
    if (existingArtist) {
      return res.status(400).json({ message: "Artist already exists." });
    }

    const artist = new Artist({ name, bio, image });
    await artist.save();

    res.status(201).json({ message: "Artist registered successfully.", artist });
  } catch (error) {
    console.error("Error registering artist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch artist details & music
const getArtistPage = async (req, res) => {
  try {
    const artist = await Artist.findOne().lean();
    if (!artist) {
      return res.status(404).json({ message: "Artist not found." });
    }

    // Make sure image URL is complete
    const imageUrl = artist.image?.includes("http")
      ? artist.image
      : `${BASE_URL}${artist.image}`;

    // Populate the artist field for both song queries:
    const allSongs = await Music.find({ artist: artist._id }).populate('artist', 'name');
    const topSongs = await Music.find({ artist: artist._id })
      .populate('artist', 'name')
      .sort({ playCount: -1 })
      .limit(5);

    // Disable cache for images
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.status(200).json({
      artist: { ...artist, image: imageUrl },
      topSongs,
      allSongs,
    });
  } catch (error) {
    console.error("🔥 Error fetching artist page:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
// Update Artist Image
const updateArtistImage = async (req, res) => {
  try {
    const artist = await Artist.findOne();
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Use Cloudinary secure URL from req.file.path (or req.file.secure_url)
    // Depending on the Cloudinary storage configuration, it might be req.file.path or req.file.secure_url.
    // Check your CloudinaryStorage docs if needed.
    const newImageUrl = req.file.path || req.file.secure_url;

    // Optionally: You can delete the old image from Cloudinary if needed using its public_id

    artist.image = newImageUrl;
    await artist.save();

    res.json({ message: "Artist image updated", imageUrl: artist.image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = { registerArtist, getArtistPage, updateArtistImage };

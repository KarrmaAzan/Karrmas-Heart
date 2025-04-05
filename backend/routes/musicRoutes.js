import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  uploadMiddleware,
  getAllMusic,
  streamMusic,
  incrementPlayCount
} from '../controllers/musicController.js';
import Artist from '../models/Artist.js';
import Music from '../models/Music.js'; // ✅ Required for new Music()

const router = express.Router();

// 🔹 Upload music (linked to the artist)
router.post('/', protect, admin, uploadMiddleware, async (req, res) => {
  try {
    const { title, duration, description } = req.body;

    console.log("Request file:", req.file);

    let fileUrl;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
    }

    if (!fileUrl) {
      console.error("No file uploaded or fileUrl provided");
      return res.status(400).json({ message: 'No file uploaded or fileUrl provided' });
    }

    const artist = await Artist.findOne();
    if (!artist) {
      console.error("Artist not found");
      return res.status(404).json({ message: 'Artist not found. Register an artist first.' });
    }

    const newSong = new Music({ 
      title, 
      fileUrl, 
      duration, 
      description, 
      artist: artist._id 
    });

    await newSong.save();

    console.log("Uploaded song:", newSong);
    res.status(201).json({ message: 'Song uploaded successfully.', song: newSong });
  } catch (error) {
    console.error('Error uploading song:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 🔹 Get all music
router.get('/', getAllMusic);

// 🔹 Stream a song by ID
router.get('/stream/:id', streamMusic);

// 🔹 Increment play count
router.patch('/increment-playcount/:id', protect, incrementPlayCount);

export default router; // ✅ Required for ESM usage

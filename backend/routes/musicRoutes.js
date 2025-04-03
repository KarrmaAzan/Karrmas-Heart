const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  uploadMiddleware,
  getAllMusic,
  streamMusic,
  incrementPlayCount
} = require('../controllers/musicController');
const Artist = require('../models/Artist');


// 🔹 Upload music (linked to the artist)
router.post('/', protect, admin, uploadMiddleware, async (req, res) => {
  try {
    // Destructure title, duration, description from req.body.
    // Note: We intentionally do not extract fileUrl from req.body.
    const { title, duration, description } = req.body;
    
    // Log to verify if Multer processed a file.
    console.log("Request file:", req.file);

    // Build fileUrl from the uploaded file if available.
    let fileUrl;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.fileUrl) {
      // Fallback in case you want to supply a URL via request body.
      fileUrl = req.body.fileUrl;
    }
    
    // If no file URL is available, return an error.
    if (!fileUrl) {
      console.error("No file uploaded or fileUrl provided");
      return res.status(400).json({ message: 'No file uploaded or fileUrl provided' });
    }
    
    // Find the artist in the database (assuming there's only one)
    const artist = await Artist.findOne();
    if (!artist) {
      console.error("Artist not found");
      return res.status(404).json({ message: 'Artist not found. Register an artist first.' });
    }
    
    // Create and save the new song, linking it to the artist.
    const newSong = new (require('../models/Music'))({ 
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

// 🔹 Get all music (Already works)
router.get('/', getAllMusic);

// 🔹 Stream a song by ID (Already works)
router.get('/stream/:id', streamMusic);

router.patch('/increment-playcount/:id', protect, incrementPlayCount);

module.exports = router;

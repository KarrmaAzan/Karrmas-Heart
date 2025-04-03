const express = require('express');
const router = express.Router();
const { registerArtist, getArtistPage, updateArtistImage } = require('../controllers/artistController');
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

// Register the artist (with optional image upload)
router.post('/register', upload.single('image'), registerArtist);

// Get artist page
router.get('/', getArtistPage);

// Update artist image
router.put('/update-image', protect, admin, upload.single('image'), updateArtistImage);

module.exports = router;

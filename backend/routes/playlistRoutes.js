// routes/playlistRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createPlaylist, addTrackToPlaylist } = require('../controllers/playlistController');

router.post('/', protect, createPlaylist);
router.put('/add-track', protect, addTrackToPlaylist);

module.exports = router;

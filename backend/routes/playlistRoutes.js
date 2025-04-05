import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createPlaylist, addTrackToPlaylist } from "../controllers/playlistController.js";

const router = express.Router();

// Create a new playlist
router.post('/create', protect, createPlaylist);

// Add a track to a playlist
router.put('/add-track', protect, addTrackToPlaylist);

export default router;

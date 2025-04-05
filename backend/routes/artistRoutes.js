import express from 'express';
import { registerArtist, getArtistPage, updateArtistImage } from '../controllers/artistController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', upload.single('image'), registerArtist);
router.get('/', getArtistPage);
router.put('/update-image', protect, admin, upload.single('image'), updateArtistImage);

export default router;

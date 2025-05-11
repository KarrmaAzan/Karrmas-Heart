import express from 'express';
import { createAlbum, getAlbums } from '../controllers/albumController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const router = express.Router();

// ✅ Allow both coverImage and tracks[]
router.post(
  '/',
  protect,
  admin,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'tracks', maxCount: 50 }
  ]),
  createAlbum
);

router.get('/', getAlbums);

export default router;

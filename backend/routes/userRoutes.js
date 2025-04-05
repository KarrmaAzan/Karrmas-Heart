import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getProfile, updatePushToken } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/push-token', protect, updatePushToken);

export default router;

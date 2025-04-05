import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createCheckoutSession } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/checkout-session', protect, createCheckoutSession);

export default router;

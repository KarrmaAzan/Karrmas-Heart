import express from 'express';
import { trackPlayback } from '../controllers/analyticController.js';

const router = express.Router();

router.put('/track/:id', trackPlayback);

export default router;

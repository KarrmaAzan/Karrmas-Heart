// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updatePushToken } = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/push-token', protect, updatePushToken);

module.exports = router;

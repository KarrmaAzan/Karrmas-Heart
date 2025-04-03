// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { trackPlayback } = require('../controllers/analyticController');

router.put('/track/:id', trackPlayback);

module.exports = router;

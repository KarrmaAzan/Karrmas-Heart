const express = require('express');
const router = express.Router();
const { searchMusic } = require('../controllers/searchController');

// Updated route: no '/music' suffix so the endpoint is /api/v1/search
router.get('/', searchMusic);

module.exports = router;

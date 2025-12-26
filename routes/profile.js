const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/auth');

// GET /api/profile - Get profile (public)
router.get('/', profileController.get);

// PUT /api/profile - Update profile (protected)
router.put('/', authMiddleware, profileController.update);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// POST /api/auth/login - Login
router.post('/login', authController.login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', authMiddleware, authController.me);

// PUT /api/auth/change-password - Change password (protected)
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;

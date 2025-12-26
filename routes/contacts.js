const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authMiddleware } = require('../middleware/auth');

// GET /api/contacts - Get all contacts (protected)
router.get('/', authMiddleware, contactController.getAll);

// GET /api/contacts/:id - Get single contact (protected)
router.get('/:id', authMiddleware, contactController.getOne);

// POST /api/contacts - Create contact (public - for contact form)
router.post('/', contactController.create);

// PUT /api/contacts/:id/read - Toggle read status (protected)
router.put('/:id/read', authMiddleware, contactController.toggleRead);

// DELETE /api/contacts/:id - Delete contact (protected)
router.delete('/:id', authMiddleware, contactController.delete);

module.exports = router;

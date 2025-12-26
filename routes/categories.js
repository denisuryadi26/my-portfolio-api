const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware } = require('../middleware/auth');

// GET /api/categories - Get all categories (public)
router.get('/', categoryController.getAll);

// GET /api/categories/:id - Get single category (public)
router.get('/:id', categoryController.getOne);

// POST /api/categories - Create category (protected)
router.post('/', authMiddleware, categoryController.create);

// PUT /api/categories/:id - Update category (protected)
router.put('/:id', authMiddleware, categoryController.update);

// DELETE /api/categories/:id - Delete category (protected)
router.delete('/:id', authMiddleware, categoryController.delete);

module.exports = router;

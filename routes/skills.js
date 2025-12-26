const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { authMiddleware } = require('../middleware/auth');

// GET /api/skills - Get all skills (public)
router.get('/', skillController.getAll);

// GET /api/skills/:id - Get single skill (public)
router.get('/:id', skillController.getOne);

// POST /api/skills - Create skill (protected)
router.post('/', authMiddleware, skillController.create);

// PUT /api/skills/:id - Update skill (protected)
router.put('/:id', authMiddleware, skillController.update);

// DELETE /api/skills/:id - Delete skill (protected)
router.delete('/:id', authMiddleware, skillController.delete);

module.exports = router;

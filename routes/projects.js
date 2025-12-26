const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authMiddleware } = require('../middleware/auth');

// GET /api/projects - Get all projects (public)
router.get('/', projectController.getAll);

// GET /api/projects/:id - Get single project (public)
router.get('/:id', projectController.getOne);

// POST /api/projects - Create project (protected)
router.post('/', authMiddleware, projectController.create);

// PUT /api/projects/:id - Update project (protected)
router.put('/:id', authMiddleware, projectController.update);

// DELETE /api/projects/:id - Delete project (protected)
router.delete('/:id', authMiddleware, projectController.delete);

module.exports = router;

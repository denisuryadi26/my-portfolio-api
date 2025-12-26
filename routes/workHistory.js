const express = require('express');
const router = express.Router();
const workHistoryController = require('../controllers/workHistoryController');
const { authMiddleware } = require('../middleware/auth');

// GET /api/work-history - Get all work history (public)
router.get('/', workHistoryController.getAll);

// GET /api/work-history/:id - Get single job (public)
router.get('/:id', workHistoryController.getOne);

// POST /api/work-history - Create job (protected)
router.post('/', authMiddleware, workHistoryController.create);

// PUT /api/work-history/:id - Update job (protected)
router.put('/:id', authMiddleware, workHistoryController.update);

// DELETE /api/work-history/:id - Delete job (protected)
router.delete('/:id', authMiddleware, workHistoryController.delete);

module.exports = router;

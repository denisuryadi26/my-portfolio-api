const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authMiddleware } = require('../middleware/auth');

// GET /api/certificates - Get all certificates (public)
router.get('/', certificateController.getAll);

// GET /api/certificates/:id - Get single certificate (public)
router.get('/:id', certificateController.getOne);

// POST /api/certificates - Create certificate (protected)
router.post('/', authMiddleware, certificateController.create);

// PUT /api/certificates/:id - Update certificate (protected)
router.put('/:id', authMiddleware, certificateController.update);

// DELETE /api/certificates/:id - Delete certificate (protected)
router.delete('/:id', authMiddleware, certificateController.delete);

module.exports = router;

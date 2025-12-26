const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Public routes (no authentication required)

// Get all landing page data in one call
router.get('/landing', publicController.getLandingData);

// Submit contact form
router.post('/contact', publicController.submitContact);

// Get project by slug
router.get('/project/:slug', publicController.getProjectBySlug);

module.exports = router;

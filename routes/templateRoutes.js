const express = require('express');
const router = express.Router();
const { createTemplate, getTemplates } = require('../controllers/templateController');
const { protect } = require('../middleware/authMiddleware');

// Lock them down with the `protect` middleware!
router.post('/', protect, createTemplate);
router.get('/', protect, getTemplates);

module.exports = router;
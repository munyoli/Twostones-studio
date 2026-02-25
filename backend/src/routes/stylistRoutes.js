const express = require('express');
const router = express.Router();
const stylistController = require('../controllers/stylistController');

// POST /api/stylist/recommend
// Accepts both JSON (manual mode) and multipart/form-data (photo upload mode)
router.post('/recommend', stylistController.upload.single('photo'), stylistController.recommend);

module.exports = router;

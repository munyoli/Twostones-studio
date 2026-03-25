const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Allow anyone to record a visit
router.post('/visit', analyticsController.recordVisit);

// Fetch stats for dashboard
router.get('/stats', analyticsController.getStats);

module.exports = router;

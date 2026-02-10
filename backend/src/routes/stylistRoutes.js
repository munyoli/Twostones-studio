const express = require('express');
const router = express.Router();
const stylistController = require('../controllers/stylistController');

router.post('/recommend', stylistController.recommend);

module.exports = router;

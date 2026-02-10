const express = require('express');
const router = express.Router();
const manukatoController = require('../controllers/manukatoController');

router.get('/', manukatoController.getAllItems);
router.get('/:id', manukatoController.getItemById);

module.exports = router;

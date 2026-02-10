const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct } = require('../controllers/productController');
const { auth, admin } = require('../middleware/authMiddleware');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', auth, admin, createProduct);

module.exports = router;

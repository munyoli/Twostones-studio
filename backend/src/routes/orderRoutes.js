const express = require('express');
const router = express.Router();
const { checkout, getMyOrders } = require('../controllers/orderController');
const { auth } = require('../middleware/authMiddleware');

router.post('/checkout', auth, checkout);
router.get('/my-orders', auth, getMyOrders);

module.exports = router;

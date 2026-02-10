
const express = require('express');
const router = express.Router();
const {
    getAllClients,
    updateClient,
    deleteClient
} = require('../controllers/adminController');
const {
    getAllOrders,
    updateOrderStatus,
    markOrderAsPaid
} = require('../controllers/adminOrderController');
const { auth, admin } = require('../middleware/authMiddleware');

// All routes here require admin privileges
router.use(auth, admin);

// Clients
router.get('/clients', getAllClients);
router.put('/clients/:id', updateClient);
router.delete('/clients/:id', deleteClient);

// Orders
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/mark-paid', markOrderAsPaid);

// Journals (Placeholder)
router.get('/journals', (req, res) => {
    res.json({ message: 'Journal management coming soon' });
});

module.exports = router;

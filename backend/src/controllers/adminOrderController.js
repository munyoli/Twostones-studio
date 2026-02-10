const { Order, OrderItem, Product, User } = require('../models');
const { sendPaymentConfirmation } = require('../services/emailService');

// Get all orders for admin dashboard
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product' }]
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Order.findByPk(id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: 'Error updating order status', error: error.message });
    }
};

// Mark order as paid
const markOrderAsPaid = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id, {
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product' }]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.payment_status === 'paid') {
            return res.status(400).json({ message: 'Order is already marked as paid' });
        }

        // Update payment status
        order.payment_status = 'paid';
        order.status = 'paid'; // Also update order status
        await order.save();

        // Send payment confirmation email
        const emailTo = order.customer_email;
        if (emailTo) {
            sendPaymentConfirmation(order, order.items, emailTo).catch(err =>
                console.error('Payment confirmation email failed:', err)
            );
        }

        res.json({
            message: 'Order marked as paid successfully',
            order
        });
    } catch (error) {
        console.error('Error marking order as paid:', error);
        res.status(500).json({ message: 'Error updating order' });
    }
};

module.exports = {
    getAllOrders,
    updateOrderStatus,
    markOrderAsPaid
};

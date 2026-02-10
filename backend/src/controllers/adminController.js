const { User, Order, OrderItem, Product, ProductImage } = require('../models');
const { Op } = require('sequelize');

// --- Clients ---

const getAllClients = async (req, res) => {
    try {
        const { search, sortBy = 'name', order = 'ASC' } = req.query;
        let where = { role: 'customer' };

        if (search) {
            where = {
                ...where,
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const clients = await User.findAll({
            where,
            order: [[sortBy, order]],
            attributes: { exclude: ['password'] }
        });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clients', error: error.message });
    }
};

const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, measurements } = req.body;
        const user = await User.findByPk(id);

        if (!user) return res.status(404).json({ message: 'Client not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (measurements) user.measurements = measurements;

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error updating client', error: error.message });
    }
};

const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'Client not found' });

        await user.destroy();
        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting client', error: error.message });
    }
};

// --- Orders ---

const getAllOrders = async (req, res) => {
    try {
        const { status, search } = req.query;
        let where = {};

        if (status) where.status = status;

        const orders = await Order.findAll({
            where,
            include: [
                { model: User, as: 'user', attributes: ['name', 'email'] },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product', include: [{ model: ProductImage, as: 'images' }] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
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

module.exports = {
    getAllClients,
    updateClient,
    deleteClient,
    getAllOrders,
    updateOrderStatus
};

const { ManukatoItem } = require('../models');

const getAllItems = async (req, res) => {
    try {
        const items = await ManukatoItem.findAll({
            where: { isActive: true },
            order: [['createdAt', 'DESC']]
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching collection' });
    }
};

const getItemById = async (req, res) => {
    try {
        const item = await ManukatoItem.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item' });
    }
};

module.exports = { getAllItems, getItemById };

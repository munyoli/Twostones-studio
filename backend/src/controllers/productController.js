const { Product, Category, ProductImage } = require('../models');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { is_active: true },
            include: [
                { model: Category, as: 'category' },
                { model: ProductImage, as: 'images' }
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: Category, as: 'category' },
                { model: ProductImage, as: 'images' }
            ]
        });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product' });
    }
};

module.exports = { getAllProducts, getProductById, createProduct };

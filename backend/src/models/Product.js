const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = Product;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    payment_status: {
        type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
        defaultValue: 'unpaid'
    },
    shipping_address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    payment_method: {
        type: DataTypes.ENUM('manual', 'mpesa', 'card'),
        defaultValue: 'manual'
    },
    customer_email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    customer_phone: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Order;

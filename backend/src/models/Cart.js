const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true // Allow for guest carts initially (linked to session/localstorage on frontend)
    },
    status: {
        type: DataTypes.ENUM('active', 'completed', 'abandoned'),
        defaultValue: 'active'
    }
}, {
    timestamps: true
});

module.exports = Cart;

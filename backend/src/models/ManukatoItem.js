const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const ManukatoItem = sequelize.define('ManukatoItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    originalName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    imagePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brandName: {
        type: DataTypes.STRING,
        allowNull: true // AI generated
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true // AI generated
    },
    stylingTips: {
        type: DataTypes.TEXT,
        allowNull: true // AI generated
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = ManukatoItem;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const PageVisit = sequelize.define('PageVisit', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    referrer: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userAgent: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'page_visits',
    timestamps: false // We use our own timestamp
});

module.exports = PageVisit;

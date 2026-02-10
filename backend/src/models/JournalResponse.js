const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const JournalResponse = sequelize.define('JournalResponse', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    entry_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reflection_text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = JournalResponse;

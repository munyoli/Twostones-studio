const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const JournalEntry = sequelize.define('JournalEntry', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    day_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    encounter_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    strengths: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    weaknesses: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    modern_contrast: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    identity_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    lie_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    truth_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    consequence_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    redemption_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    reflective_question: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    biblical_ref: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subtitle: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_free: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    garment_id: {
        type: DataTypes.INTEGER,
        allowNull: true // Linked fashion translation
    }
}, {
    timestamps: true
});

module.exports = JournalEntry;

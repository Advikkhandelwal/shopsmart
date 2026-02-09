const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Simple join table for User <-> Project
const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true, // Keep track of when item was added
});

module.exports = Cart;

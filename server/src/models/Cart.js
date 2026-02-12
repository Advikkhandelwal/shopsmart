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
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
    },
}, {
    timestamps: true, // Keep track of when item was added
});

module.exports = Cart;

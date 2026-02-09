const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    paidAt: {
        type: DataTypes.DATE, // Sequelize stores as DATETIME in SQLite
    },
    paymentResult: {
        type: DataTypes.JSON, // Store Stripe payment details
        allowNull: true,
    },
}, {
    timestamps: true,
});

module.exports = Order;

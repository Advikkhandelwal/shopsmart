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
        type: DataTypes.DATE,
    },
    paymentResult: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending', // pending | paid | shipped | delivered | cancelled
    },
    shippingAddress: {
        type: DataTypes.JSON,
        allowNull: true, // { address, city, postalCode, country }
    },
    isDelivered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    deliveredAt: {
        type: DataTypes.DATE,
    },
}, {
    timestamps: true,
});

module.exports = Order;

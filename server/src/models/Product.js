const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    category: {
        // kept for backward compatibility with existing seed/UI
        type: DataTypes.STRING,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    collectionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    imageUrl: {
        type: DataTypes.STRING,
    },
});

module.exports = Product;

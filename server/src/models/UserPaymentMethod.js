const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserPaymentMethod = sequelize.define(
  'UserPaymentMethod',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'stripe',
    },
    providerCustomerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    providerPaymentMethodId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last4: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    expYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

module.exports = UserPaymentMethod;


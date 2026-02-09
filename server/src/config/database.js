const { Sequelize } = require('sequelize');
const path = require('path');

const storagePath = path.join(__dirname, '../../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false, // Set to console.log to see SQL queries
});

module.exports = sequelize;

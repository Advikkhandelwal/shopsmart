const sequelize = require('../config/database');
const User = require('./User');
const Project = require('./Project');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');

// User <-> Project (Cart)
User.belongsToMany(Project, { through: Cart, as: 'cartItems', foreignKey: 'userId' });
Project.belongsToMany(User, { through: Cart, as: 'inCarts', foreignKey: 'projectId' });

// User <-> Order
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Order <-> Project (OrderItem)
Order.belongsToMany(Project, { through: OrderItem, foreignKey: 'orderId' });
Project.belongsToMany(Order, { through: OrderItem, foreignKey: 'projectId' });

module.exports = {
    sequelize,
    User,
    Project,
    Order,
    OrderItem,
    Cart,
};

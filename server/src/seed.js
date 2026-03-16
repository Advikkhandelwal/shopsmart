const bcrypt = require('bcryptjs');
const axios = require('axios');
const { sequelize, User, Product } = require('./models/index');

const seedData = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      isAdmin: true,
      googleId: 'google_id_admin_123',
    });

    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      isAdmin: false,
      googleId: 'google_id_john_456',
    });

    console.log('Users seeded (admin@example.com / admin123, john@example.com / user123)');

    // Fetch products from external API
    const { data } = await axios.get('https://dummyjson.com/products?limit=50');
    const externalProducts = Array.isArray(data.products) ? data.products : [];

    const products = externalProducts.map((p) => ({
      name: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock ?? 0,
      imageUrl: (p.images && p.images[0]) || p.thumbnail || null,
    }));

    await Product.bulkCreate(products);
    console.log(`Products seeded from dummyjson (${products.length} items).`);

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

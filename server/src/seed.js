const bcrypt = require('bcryptjs');
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

        // Create Products
        const products = [
            // Electronics
            {
                name: 'Smartphone X Pro',
                description: 'Latest model with high-resolution camera and long battery life.',
                price: 999.99,
                category: 'Electronics',
                stock: 50,
                imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=60'
            },
            {
                name: 'Laptop Ultra 15',
                description: 'Powerful laptop for professionals and gamers.',
                price: 1299.99,
                category: 'Electronics',
                stock: 30,
                imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=60'
            },

            // Clothes & Fashion
            {
                name: 'Classic White T-Shirt',
                description: 'Premium cotton t-shirt, comfortable and stylish.',
                price: 19.99,
                category: 'Clothes',
                stock: 100,
                imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=60'
            },
            {
                name: 'Denim Jacket',
                description: 'Vintage style denim jacket for all seasons.',
                price: 59.99,
                category: 'Clothes',
                stock: 40,
                imageUrl: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=500&q=60'
            },

            // Books
            {
                name: 'The Great Gatsby',
                description: 'Classic novel by F. Scott Fitzgerald.',
                price: 14.99,
                category: 'Books',
                stock: 60,
                imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=60'
            },
            {
                name: 'Atomic Habits',
                description: 'Self-help book by James Clear.',
                price: 24.99,
                category: 'Books',
                stock: 80,
                imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=60'
            },

            // Groceries
            {
                name: 'Organic Honey',
                description: 'Pure, raw organic honey.',
                price: 12.99,
                category: 'Groceries',
                stock: 50,
                imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=500&q=60'
            },
            {
                name: 'Fresh Coffee Beans',
                description: 'Arabica coffee beans, medium roast.',
                price: 18.99,
                category: 'Groceries',
                stock: 40,
                imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=500&q=60'
            },

            // Furniture
            {
                name: 'Modern Sofa',
                description: 'Comfortable 3-seater sofa with modern design.',
                price: 499.99,
                category: 'Furniture',
                stock: 10,
                imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=60'
            },
            {
                name: 'Wooden Coffee Table',
                description: 'Handcrafted oak wood coffee table.',
                price: 149.99,
                category: 'Furniture',
                stock: 15,
                imageUrl: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=500&q=60'
            },

            // Accessories
            {
                name: 'Leather Wallet',
                description: 'Genuine leather wallet with multiple card slots.',
                price: 39.99,
                category: 'Accessories',
                stock: 70,
                imageUrl: 'https://images.unsplash.com/photo-1627123424574-181ce5171c98?auto=format&fit=crop&w=500&q=60'
            },
            {
                name: 'Sunglasses',
                description: 'UV protection sunglasses with stylish frame.',
                price: 29.99,
                category: 'Accessories',
                stock: 60,
                imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=60'
            }
        ];

        await Product.bulkCreate(products);
        console.log('Products seeded');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();

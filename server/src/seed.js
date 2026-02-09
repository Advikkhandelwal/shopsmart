const { sequelize, User, Project } = require('./models/index');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced');

        // Create Users
        // Since we are using Google Auth, password is secondary but we can seed one admin for manual testing if needed
        // But our User model doesn't strictly enforce password if googleId is there.
        // For seeding let's just create dummy users.

        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            isAdmin: true,
            googleId: 'google_id_admin_123'
        });

        await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            isAdmin: false,
            googleId: 'google_id_john_456'
        });

        console.log('Users seeded');

        // Create Projects
        const projects = [
            {
                title: 'Chat App using MERN',
                description: 'A full-featured real-time chat application using MongoDB, Express, React, and Node.js. Includes authentication, rooms, and messaging.',
                price: 49.99,
                category: 'Web Development',
                image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=500&q=60',
                fileUrl: 'https://example.com/downloads/chat-app.zip'
            },
            {
                title: 'E-commerce Website React',
                description: 'Production-ready e-commerce template with cart, checkout, and admin dashboard.',
                price: 79.99,
                category: 'Web Development',
                image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=500&q=60',
                fileUrl: 'https://example.com/downloads/ecommerce.zip'
            },
            {
                title: 'AI Chatbot Python',
                description: 'Python-based chatbot using NLP and Machine Learning libraries. Easy to integrate.',
                price: 29.99,
                category: 'AI & Machine Learning',
                image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=500&q=60',
                fileUrl: 'https://example.com/downloads/chatbot.zip'
            },
            {
                title: 'Portfolio Website',
                description: 'Sleek and modern portfolio website template for developers and designers.',
                price: 19.99,
                category: 'Web Design',
                image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=500&q=60',
                fileUrl: 'https://example.com/downloads/portfolio.zip'
            }
        ];

        await Project.bulkCreate(projects);
        console.log('Projects seeded');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();

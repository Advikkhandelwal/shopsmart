const express = require('express');
require('express-async-errors');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');

const reviewRoutes = require('./routes/reviewRoutes');
const addressRoutes = require('./routes/addressRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { stripeWebhook } = require('./controllers/orderController');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.post('/orders/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// new
app.use('/products/:id/reviews', reviewRoutes);
app.use('/addresses', addressRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;

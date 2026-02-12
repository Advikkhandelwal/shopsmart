const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
function getStripe() {
    if (process.env.STRIPE_SECRET_KEY) {
        return require('stripe')(process.env.STRIPE_SECRET_KEY);
    }
    return null;
}

// @desc    Create new order from cart
// @route   POST /orders
exports.addOrderItems = async (req, res) => {
    try {
        const { shippingAddress } = req.body;

        const carts = await Cart.findAll({
            where: { userId: req.user.id },
            include: [{ model: Product, attributes: ['id', 'name', 'price', 'stock'] }],
        });

        if (!carts.length) {
            return res.status(400).json({ message: 'No items in cart' });
        }

        const orderItemInputs = [];
        let totalPrice = 0;

        for (const row of carts) {
            const product = row.Product;
            if (!product) continue;
            const qty = row.quantity || 1;
            if (product.stock < qty) {
                return res.status(400).json({
                    message: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${qty}`,
                });
            }
            orderItemInputs.push({
                productId: product.id,
                quantity: qty,
                price: product.price,
            });
            totalPrice += product.price * qty;
        }

        const order = await Order.create({
            userId: req.user.id,
            totalPrice,
            isPaid: false,
            status: 'pending',
            shippingAddress: shippingAddress || null,
        });

        for (const item of orderItemInputs) {
            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            });
            await Product.decrement('stock', {
                by: item.quantity,
                where: { id: item.productId },
            });
        }

        await Cart.destroy({ where: { userId: req.user.id } });

        const created = await Order.findByPk(order.id, {
            include: [
                { model: OrderItem, include: [Product] },
                { model: User, attributes: ['id', 'name', 'email'] },
            ],
        });
        res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /orders/:id
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: OrderItem, include: [{ model: Product, attributes: ['id', 'name', 'price', 'imageUrl', 'category'] }] },
            ],
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (!req.user.isAdmin && order.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged-in user's orders
// @route   GET /orders/myorders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [{ model: OrderItem, include: [{ model: Product, attributes: ['id', 'name', 'price', 'imageUrl'] }] }],
            order: [['createdAt', 'DESC']],
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order stats (Admin)
// @route   GET /orders/stats
exports.getOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.count();
        const paidOrders = await Order.count({ where: { isPaid: true } });
        const totalRevenue = await Order.sum('totalPrice', { where: { isPaid: true } });
        res.json({
            totalOrders,
            paidOrders,
            totalRevenue: totalRevenue || 0,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: OrderItem, include: [{ model: Product, attributes: ['id', 'name', 'price'] }] },
            ],
            order: [['createdAt', 'DESC']],
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to paid
// @route   PUT /orders/:id/pay
exports.updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (!req.user.isAdmin && order.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        order.isPaid = true;
        order.paidAt = new Date();
        order.status = 'paid';
        order.paymentResult = {
            id: req.body.id || 'mock_payment_id',
            status: req.body.status || 'success',
            update_time: req.body.update_time || Date.now(),
            email_address: req.body.email_address || req.user.email,
        };
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to delivered (Admin)
// @route   PUT /orders/:id/deliver
exports.updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.isDelivered = true;
        order.deliveredAt = new Date();
        order.status = 'delivered';
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Stripe Checkout Session
// @route   POST /orders/:id/checkout
exports.createCheckoutSession = async (req, res) => {
    const stripe = getStripe();
    if (!stripe) {
        return res.status(503).json({ message: 'Payment provider not configured' });
    }

    try {
        const order = await Order.findByPk(req.params.id, {
            include: [{ model: OrderItem, include: [{ model: Product }] }],
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.userId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const orderItems = await OrderItem.findAll({
            where: { orderId: order.id },
            include: [{ model: Product }],
        });

        const line_items = orderItems.map((oi) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: oi.Product.name,
                    description: (oi.Product.description || '').substring(0, 100) || 'Product',
                    images: oi.Product.imageUrl ? [oi.Product.imageUrl] : [],
                },
                unit_amount: Math.round(oi.price * 100),
            },
            quantity: oi.quantity || 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order/${order.id}?success=true`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order/${order.id}?canceled=true`,
            client_reference_id: order.id.toString(),
            customer_email: req.user.email,
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Stripe webhook – mark order paid on checkout.session.completed
// @route   POST /orders/webhook (raw body; register before express.json())
exports.stripeWebhook = async (req, res) => {
    const stripe = getStripe();
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe || !endpointSecret) {
        return res.status(503).json({ message: 'Webhook not configured' });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ message: `Webhook Error: ${err.message}` });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.client_reference_id;
        if (orderId) {
            const order = await Order.findByPk(orderId);
            if (order && !order.isPaid) {
                order.isPaid = true;
                order.paidAt = new Date();
                order.status = 'paid';
                order.paymentResult = {
                    id: session.payment_intent || session.id,
                    status: 'success',
                    email_address: session.customer_email,
                };
                await order.save();
            }
        }
    }

    res.json({ received: true });
};

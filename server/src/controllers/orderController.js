const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const Project = require('../models/Project');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create new order
// @route   POST /api/orders
exports.addOrderItems = async (req, res) => {
    try {
        // 1. Get User's Cart
        const user = await User.findByPk(req.user.id, {
            include: { model: Project, as: 'cartItems' }
        });

        if (!user.cartItems || user.cartItems.length === 0) {
            return res.status(400).json({ message: 'No items in cart' });
        }

        // 2. Calculate Total Price
        const totalPrice = user.cartItems.reduce((acc, item) => acc + item.price, 0);

        // 3. Create Order
        const order = await Order.create({
            userId: req.user.id,
            totalPrice,
            isPaid: false, // Default
        });

        // 4. Create Order Items
        for (const item of user.cartItems) {
            await OrderItem.create({
                orderId: order.id,
                projectId: item.id,
                price: item.price
            });
        }

        // 5. Clear Cart
        await Cart.destroy({ where: { userId: req.user.id } });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: Project, through: { attributes: ['price'] } } // Include projects in order
            ]
        });

        if (order) {
            // Only Admin or Order Owner can view
            if (req.user.isAdmin || order.userId === req.user.id) {
                res.json(order);
            } else {
                res.status(401).json({ message: 'Not authorized' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to paid (Mock or Stripe Webhook)
// @route   PUT /api/orders/:id/pay
exports.updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id || 'mock_payment_id',
                status: req.body.status || 'success',
                update_time: req.body.update_time || Date.now(),
                email_address: req.body.email_address || req.user.email,
            };

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Stripe Checkout Session
// @route   POST /api/orders/:id/checkout
exports.createCheckoutSession = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: {
                model: Project,
                through: { attributes: ['price'] }
            }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.userId !== req.user.id && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const line_items = order.Projects.map(project => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: project.title,
                        description: project.description ? project.description.substring(0, 100) : 'Digital Product',
                        images: [project.image],
                    },
                    unit_amount: Math.round(project.OrderItem.price * 100),
                },
                quantity: 1,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `http://localhost:5173/order/${order.id}?success=true`,
            cancel_url: `http://localhost:5173/order/${order.id}?canceled=true`,
            client_reference_id: order.id.toString(),
            customer_email: req.user.email,
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

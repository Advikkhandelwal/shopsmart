const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get user cart
// @route   GET /api/cart
exports.getCart = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: {
                model: Product,
                as: 'cartItems',
                through: {
                    attributes: ['id'] // Include Cart ID to allow removal
                }
            }
        });

        res.json(user.cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
exports.addToCart = async (req, res) => {
    const { productId } = req.body;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if already in cart
        const existingItem = await Cart.findOne({
            where: { userId: req.user.id, productId: productId }
        });

        if (existingItem) {
            return res.status(400).json({ message: 'Item already in cart' });
        }

        const cartItem = await Cart.create({
            userId: req.user.id,
            productId: productId
        });

        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
exports.removeFromCart = async (req, res) => {
    try {
        // We expect the Product ID here to remove from cart
        const deleted = await Cart.destroy({
            where: {
                userId: req.user.id,
                productId: req.params.id
            }
        });

        if (deleted) {
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

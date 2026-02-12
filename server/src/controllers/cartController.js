const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get user cart
// @route   GET /cart
exports.getCart = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: {
                model: Product,
                as: 'cartItems',
                through: { attributes: ['id', 'quantity'] },
                attributes: ['id', 'name', 'price', 'description', 'category', 'stock', 'imageUrl'],
            },
        });

        const items = (user.cartItems || []).map((p) => ({
            productId: p.id,
            quantity: p.Cart?.quantity ?? 1,
            product: {
                id: p.id,
                name: p.name,
                price: p.price,
                description: p.description,
                category: p.category,
                stock: p.stock,
                imageUrl: p.imageUrl,
            },
        }));

        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /cart
exports.addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const requestedQty = Math.max(1, parseInt(quantity, 10) || 1);
        const existingItem = await Cart.findOne({
            where: { userId: req.user.id, productId },
        });

        const newTotal = existingItem ? existingItem.quantity + requestedQty : requestedQty;
        if (product.stock < newTotal) {
            return res.status(400).json({
                message: `Insufficient stock. Available: ${product.stock}, requested: ${newTotal}`,
            });
        }

        if (existingItem) {
            existingItem.quantity = newTotal;
            await existingItem.save();
            return res.status(200).json(existingItem);
        }

        const cartItem = await Cart.create({
            userId: req.user.id,
            productId,
            quantity: requestedQty,
        });

        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update quantity
// @route   PUT /cart/:productId
exports.updateQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        const qty = parseInt(quantity, 10);
        if (isNaN(qty) || qty < 1) {
            return res.status(400).json({ message: 'Quantity must be a positive number' });
        }

        const item = await Cart.findOne({
            where: { userId: req.user.id, productId },
            include: [{ model: Product, attributes: ['stock'] }],
        });

        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        const product = item.Product;
        if (product && product.stock < qty) {
            return res.status(400).json({
                message: `Insufficient stock. Available: ${product.stock}`,
            });
        }

        item.quantity = qty;
        await item.save();
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /cart/:productId
exports.removeFromCart = async (req, res) => {
    try {
        const deleted = await Cart.destroy({
            where: {
                userId: req.user.id,
                productId: req.params.productId,
            },
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

// @desc    Clear cart
// @route   DELETE /cart
exports.clearCart = async (req, res) => {
    try {
        await Cart.destroy({ where: { userId: req.user.id } });
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

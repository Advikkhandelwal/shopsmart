const Cart = require('../models/Cart');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get user cart
// @route   GET /api/cart
exports.getCart = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: {
                model: Project,
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
    const { projectId } = req.body;

    try {
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if already in cart
        const existingItem = await Cart.findOne({
            where: { userId: req.user.id, projectId: projectId }
        });

        if (existingItem) {
            return res.status(400).json({ message: 'Item already in cart' });
        }

        const cartItem = await Cart.create({
            userId: req.user.id,
            projectId: projectId
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
        // We expect the Cart Table ID here, not Project ID, for simplicity in "deleting a cart item"
        // Or we can delete by projectId. let's assume valid Cart ID or Project ID. 
        // Actually, usually frontend sends Project ID to remove. Let's support removing by Project ID for standard e-com feel
        // OR we can pass the Cart Item ID. 
        // Let's stick to REST: DELETE /api/cart/:id -> where :id is the ProjectId or CartId?
        // Let's assume :id is projectId for better UX "remove this project".

        const deleted = await Cart.destroy({
            where: {
                userId: req.user.id,
                projectId: req.params.id
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

const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.delete('/', protect, clearCart);
router.put('/:productId', protect, updateQuantity);
router.delete('/:productId', protect, removeFromCart);

module.exports = router;

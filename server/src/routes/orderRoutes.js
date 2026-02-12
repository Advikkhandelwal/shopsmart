const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    getOrderStats,
    createCheckoutSession,
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/myorders', protect, getMyOrders);
router.get('/stats', protect, admin, getOrderStats);
router.route('/')
    .get(protect, admin, getOrders)
    .post(protect, addOrderItems);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);
router.post('/:id/checkout', protect, createCheckoutSession);

module.exports = router;

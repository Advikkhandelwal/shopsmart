const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middlewares/authMiddleware');
const {
  getReviewsForProduct,
  createReview,
} = require('../controllers/reviewController');

// /products/:id/reviews
router.get('/', getReviewsForProduct);
router.post('/', protect, createReview);

module.exports = router;

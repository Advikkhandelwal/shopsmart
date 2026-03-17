const { Review, OrderItem, Order, User } = require('../models');

exports.getReviewsForProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await Review.findAll({
      where: { productId: id },
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { id } = req.params; // product id
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Only allow users who bought this product
    const bought = await OrderItem.findOne({
      include: [
        {
          model: Order,
          where: { userId: req.user.id },
          attributes: [],
        },
      ],
      where: { productId: id },
    });

    if (!bought) {
      return res.status(403).json({ message: 'You can only review products you have purchased' });
    }

    // One review per user/product – upsert
    const [review, created] = await Review.findOrCreate({
      where: { userId: req.user.id, productId: id },
      defaults: { rating, comment },
    });

    if (!created) {
      review.rating = rating;
      review.comment = comment;
      await review.save();
    }

    const withUser = await Review.findByPk(review.id, {
      include: [{ model: User, attributes: ['id', 'name'] }],
    });

    res.status(created ? 201 : 200).json(withUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

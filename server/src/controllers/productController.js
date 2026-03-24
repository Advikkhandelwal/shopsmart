const { Op } = require('sequelize');
const { Product, Review } = require('../models');

// @desc    Get distinct categories
// @route   GET /products/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['category'],
      where: { category: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] } },
      // used to return plain objects instead of Sequelize instances
      raw: true,
    });
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    res.json([...set].sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products (with search, filter, pagination)
// @route   GET /products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = 1,
      pageSize = 20,
    } = req.query;
    const where = {};

    if (search && search.trim()) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search.trim()}%` } },
        { description: { [Op.like]: `%${search.trim()}%` } },
      ];
    }
    if (category && category.trim()) {
      where.category = category.trim();
    }

    const min = minPrice != null && !isNaN(Number(minPrice)) ? Number(minPrice) : null;
    const max = maxPrice != null && !isNaN(Number(maxPrice)) ? Number(maxPrice) : null;
    if (min != null || max != null) {
      where.price = {};
      if (min != null) where.price[Op.gte] = min;
      if (max != null) where.price[Op.lte] = max;
    }

    const safePageSize = Math.max(1, Math.min(100, Number(pageSize) || 20));
    const safePage = Math.max(1, Number(page) || 1);
    const offset = (safePage - 1) * safePageSize;

    const { rows, count } = await Product.findAndCountAll({
      where,
      limit: safePageSize,
      offset,
      order: [['id', 'ASC']],
    });

    const productIds = rows.map((p) => p.id);
    let aggregates = [];

    if (productIds.length) {
      aggregates = await Review.findAll({
        attributes: [
          'productId',
          [Review.sequelize.fn('COUNT', Review.sequelize.col('id')), 'reviewCount'],
          [Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'avgRating'],
        ],
        where: { productId: productIds },
        group: ['productId'],
        raw: true,
      });
    }

    const aggMap = new Map();
    aggregates.forEach((a) => {
      aggMap.set(a.productId, {
        reviewCount: Number(a.reviewCount),
        avgRating: Number(a.avgRating),
      });
    });

    const items = rows.map((p) => {
      const agg = aggMap.get(p.id) || { reviewCount: 0, avgRating: null };
      return {
        ...p.toJSON(),
        reviewCount: agg.reviewCount,
        avgRating: agg.avgRating,
      };
    });

    res.json({
      items,
      page: safePage,
      pageSize: safePageSize,
      totalItems: count,
      totalPages: Math.max(1, Math.ceil(count / safePageSize)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const agg = await Review.findOne({
      attributes: [
        [Review.sequelize.fn('COUNT', Review.sequelize.col('id')), 'reviewCount'],
        [Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'avgRating'],
      ],
      where: { productId: product.id },
      raw: true,
    });

    res.json({
      ...product.toJSON(),
      reviewCount: agg ? Number(agg.reviewCount) : 0,
      avgRating: agg ? Number(agg.avgRating) : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const { Op } = require('sequelize');
const { Product } = require('../models');

// @desc    Get distinct categories
// @route   GET /products/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: ['category'],
            where: { category: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] } },
            raw: true,
        });
        const set = new Set(products.map((p) => p.category).filter(Boolean));
        res.json([...set].sort());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all products (with search, filter)
// @route   GET /products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice } = req.query;
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

        const products = await Product.findAll({ where });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
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
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            await product.update(req.body);
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            await product.destroy();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

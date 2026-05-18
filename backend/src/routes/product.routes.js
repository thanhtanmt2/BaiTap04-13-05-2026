const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const { Op } = require('sequelize');

/**
 * @route   GET /api/products
 * @desc    Get all products with search, filter and pagination
 * @access  Public
 * @query   search, category, size, color, priceMin, priceMax, sort, page, limit
 */
router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      category = '',
      size = '',
      color = '',
      priceMin = 0,
      priceMax = 999999,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const offset = (page - 1) * limit;
    let where = { is_active: true };
    let order = [['created_at', 'DESC']];

    // Search by name
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by size
    if (size) {
      where.size = size;
    }

    // Filter by color
    if (color) {
      where.color = { [Op.like]: `%${color}%` };
    }

    // Filter by price range
    if (priceMin || priceMax) {
      where.price = {
        [Op.between]: [priceMin, priceMax]
      };
    }

    // Sort options
    switch (sort) {
      case 'price_low':
        order = [['price', 'ASC']];
        break;
      case 'price_high':
        order = [['price', 'DESC']];
        break;
      case 'rating':
        order = [['rating', 'DESC']];
        break;
      case 'best_seller':
        order = [['quantity_sold', 'DESC']];
        break;
      case 'trending':
        order = [['quantity_sold_week', 'DESC']];
        break;
      default:
        order = [['created_at', 'DESC']];
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: {
        exclude: ['description']
      }
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/products/categories/list
 * @desc    Get all available categories
 * @access  Public
 */
router.get('/categories/list', async (req, res) => {
  try {
    const categories = [
      'shirt', 'pants', 'dress', 'jacket', 'skirt',
      'shorts', 'hoodie', 'sweater', 'coat', 'accessories'
    ];

    const productsCount = await Promise.all(
      categories.map(cat =>
        Product.count({ where: { category: cat, is_active: true } })
      )
    );

    const data = categories.map((cat, idx) => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: cat,
      count: productsCount[idx]
    }));

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/products/sizes/list
 * @desc    Get all available sizes
 * @access  Public
 */
router.get('/sizes/list', async (req, res) => {
  try {
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const productsCount = await Promise.all(
      sizes.map(size =>
        Product.count({ where: { size, is_active: true } })
      )
    );

    const data = sizes.map((size, idx) => ({
      name: size,
      value: size,
      count: productsCount[idx]
    }));

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sizes',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/products/trending
 * @desc    Get trending products
 * @access  Public
 */
router.get('/trending', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { is_active: true },
      order: [['quantity_sold_week', 'DESC']],
      limit: 8,
      attributes: {
        exclude: ['description']
      }
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trending products',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/products/best-sellers
 * @desc    Get best seller products
 * @access  Public
 */
router.get('/best-sellers', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { is_active: true },
      order: [['quantity_sold', 'DESC']],
      limit: 8,
      attributes: {
        exclude: ['description']
      }
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching best sellers',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

module.exports = router;

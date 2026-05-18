const express = require('express');
const router = express.Router();
const { User, Profile, OTP, Product } = require('../models');
const { Op } = require('sequelize');

/**
 * @route   GET /api/dev/database
 * @desc    View all database tables
 * @access  Public (For development only)
 */
router.get('/database', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [Profile, OTP]
    });

    const profiles = await Profile.findAll({
      include: [{ model: User, attributes: ['id', 'email', 'role'] }]
    });

    const otps = await OTP.findAll({
      attributes: { exclude: ['otp'] }
    });

    res.json({
      success: true,
      summary: {
        totalUsers: users.length,
        totalProfiles: profiles.length,
        totalOTPs: otps.length,
        adminCount: users.filter(u => u.role === 'admin').length,
        userCount: users.filter(u => u.role === 'user').length
      },
      data: {
        users,
        profiles,
        otps
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching database',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/dev/database/users
 * @desc    View all users with profiles and OTPs
 * @access  Public
 */
router.get('/database/users', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [Profile, OTP]
    });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/dev/database/user/:id
 * @desc    View specific user with all relations
 * @access  Public
 */
router.get('/database/user/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [Profile, OTP]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/dev/database/profiles
 * @desc    View all profiles
 * @access  Public
 */
router.get('/database/profiles', async (req, res) => {
  try {
    const profiles = await Profile.findAll({
      include: [{ model: User, attributes: ['id', 'email', 'role'] }]
    });

    res.json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profiles',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/dev/database/otps
 * @desc    View all OTPs (without OTP value)
 * @access  Public
 */
router.get('/database/otps', async (req, res) => {
  try {
    const otps = await OTP.findAll({
      attributes: { exclude: ['otp'] },
      include: [{ model: User, attributes: ['id', 'email'] }]
    });

    res.json({
      success: true,
      count: otps.length,
      data: otps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching OTPs',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/dev/database/stats
 * @desc    View database statistics
 * @access  Public
 */
router.get('/database/stats', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const adminCount = await User.count({ where: { role: 'admin' } });
    const userCount = await User.count({ where: { role: 'user' } });
    const totalProfiles = await Profile.count();
    const profilesWithAvatar = await Profile.count({ 
      where: { avatar_url: { [Op.ne]: null } } 
    });
    const totalOTPs = await OTP.count();
    const activeOTPs = await OTP.count({ where: { is_used: false } });

    res.json({
      success: true,
      statistics: {
        users: {
          total: totalUsers,
          admins: adminCount,
          regularUsers: userCount
        },
        profiles: {
          total: totalProfiles,
          withAvatar: profilesWithAvatar
        },
        otps: {
          total: totalOTPs,
          active: activeOTPs,
          used: totalOTPs - activeOTPs
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/dev/database/products
 * @desc    View all products
 * @access  Public
 */
router.get('/database/products', async (req, res) => {
  try {
    const products = await Product.findAll();

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

module.exports = router;

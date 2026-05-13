const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getProfileById,
  uploadAvatar,
} = require('../controllers/profile.controller');
const { authenticateToken, authorizeAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/', authenticateToken, getProfile);
router.put('/', authenticateToken, updateProfile);
router.post('/avatar', authenticateToken, upload.single('avatar'), uploadAvatar);
router.get('/:userId', authenticateToken, authorizeAdmin, getProfileById);

module.exports = router;

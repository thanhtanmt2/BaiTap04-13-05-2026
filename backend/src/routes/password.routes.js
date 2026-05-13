const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/password.controller');
const { forgotPasswordLimiter, resetPasswordLimiter } = require('../middlewares/rateLimiter');

// POST /api/auth/forgot-password - Request OTP for password reset
router.post('/forgot-password', 
  forgotPasswordLimiter,
  passwordController.requestOTP
);

// POST /api/auth/reset-password - Reset password with OTP
router.post('/reset-password', 
  resetPasswordLimiter,
  passwordController.resetPassword
);

module.exports = router;
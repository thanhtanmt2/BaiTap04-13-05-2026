const express = require('express');
const router = express.Router();
const { login, register, verifyOtp, resendOtp } = require('../controllers/auth.controller');
const { loginLimiter, registerLimiter } = require('../middlewares/rateLimiter');

router.post('/login', loginLimiter, login);
router.post('/register', registerLimiter, register);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', registerLimiter, resendOtp);

module.exports = router;

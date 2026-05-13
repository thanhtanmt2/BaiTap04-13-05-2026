const crypto = require('crypto');

// Tao ma OTP ngau nhien 6 chu so bang crypto (an toan hon Math.random)
const generateOTP = () => {
  // randomInt(min, max) tra ve so nguyen trong [min, max-1]
  // Dam bao luon la 6 chu so (100000 - 999998)
  return crypto.randomInt(100000, 999999).toString();
};

// Tinh thoi gian het han cua OTP (mac dinh 10 phut)
const getOTPExpiryDate = (minutes = 10) => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
  return expiresAt;
};

module.exports = { generateOTP, getOTPExpiryDate };

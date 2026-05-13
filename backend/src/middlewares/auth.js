const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    // Lấy token từ Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng cung cấp token'
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET || 'secret_key_cua_ban', (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token không hợp lệ hoặc hết hạn'
        });
      }

      // Lưu thông tin user vào request
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực'
    });
  }
};

// Middleware để kiểm tra vai trò Admin
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Chỉ admin mới có quyền truy cập'
    });
  }
};

module.exports = { authenticateToken, authorizeAdmin };

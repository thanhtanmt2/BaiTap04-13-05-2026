const Joi = require('joi');

// Validation for forgot password
const forgotPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Vui lòng nhập email'
    })
  });

  return schema.validate(data);
};

// Validation for reset password
const resetPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Vui lòng nhập email'
    }),
    otp: Joi.string().pattern(/^\d{6}$/).required().messages({
      'string.pattern.base': 'Mã OTP phải là 6 chữ số',
      'any.required': 'Vui lòng nhập OTP'
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'any.required': 'Vui lòng nhập mật khẩu mới'
    })
  });

  return schema.validate(data);
};

module.exports = { 
  forgotPasswordValidation, 
  resetPasswordValidation 
};

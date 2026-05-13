const Joi = require('joi');

// Validation cho dang nhap
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Vui lòng nhập email',
      'string.empty': 'Email không được để trống',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'any.required': 'Vui lòng nhập mật khẩu',
      'string.empty': 'Mật khẩu không được để trống',
    }),
  });
  return schema.validate(data);
};

// Validation cho dang ky tai khoan moi
const registerValidation = (data) => {
  const schema = Joi.object({
    // Ten nguoi dung: toi thieu 2 ky tu
    name: Joi.string().min(2).required().messages({
      'string.min': 'Tên phải có ít nhất 2 ký tự',
      'any.required': 'Vui lòng nhập tên',
      'string.empty': 'Tên không được để trống',
    }),
    // Email hop le
    email: Joi.string().email().required().messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Vui lòng nhập email',
      'string.empty': 'Email không được để trống',
    }),
    // Mat khau: toi thieu 6 ky tu
    password: Joi.string().min(6).required().messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'any.required': 'Vui lòng nhập mật khẩu',
      'string.empty': 'Mật khẩu không được để trống',
    }),
  });
  return schema.validate(data);
};

// Validation cho xac thuc OTP
const verifyOtpValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Vui lòng nhập email',
      'string.empty': 'Email không được để trống',
    }),
    // OTP phai la chuoi 6 chu so (dung string de giu so 0 dau)
    otp: Joi.string().pattern(/^\d{6}$/).required().messages({
      'string.pattern.base': 'Mã OTP phải là 6 chữ số',
      'any.required': 'Vui lòng nhập mã OTP',
      'string.empty': 'Mã OTP không được để trống',
    }),
  });
  return schema.validate(data);
};

module.exports = { loginValidation, registerValidation, verifyOtpValidation };

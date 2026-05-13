const Joi = require('joi');

// Validation cho update profile
const updateProfileValidation = (data) => {
  const schema = Joi.object({
    full_name: Joi.string().max(255).optional().messages({
      'string.max': 'Tên không vượt quá 255 ký tự'
    }),
    phone: Joi.string().pattern(/^[0-9]{10,11}$/).optional().messages({
      'string.pattern.base': 'Số điện thoại phải có 10-11 chữ số'
    }),
    address: Joi.string().max(500).optional().messages({
      'string.max': 'Địa chỉ không vượt quá 500 ký tự'
    })
  });

  return schema.validate(data);
};

module.exports = { updateProfileValidation };

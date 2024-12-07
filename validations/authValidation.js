const Joi = require('joi');

const userValidation = {
  register: Joi.object({
    firstName: Joi.string()
      .max(50)
      .required()
      .messages({
        'string.base': 'First name must be a string.',
        'string.empty': 'First name is required.',
        'string.max': 'First name must be less than 50 characters.',
        'any.required': 'First name is required.',
      }),
    lastName: Joi.string()
      .max(50)
      .required()
      .messages({
        'string.base': 'Last name must be a string.',
        'string.empty': 'Last name is required.',
        'string.max': 'Last name must be less than 50 characters.',
        'any.required': 'Last name is required.',
      }),
    username: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.base': 'Username must be a string.',
        'string.empty': 'Username is required.',
        'string.min': 'Username must be at least 3 characters long.',
        'string.max': 'Username must be less than 30 characters.',
        'any.required': 'Username is required.',
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.base': 'Email must be a string.',
        'string.empty': 'Email is required.',
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.',
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.base': 'Password must be a string.',
        'string.empty': 'Password is required.',
        'string.min': 'Password must be at least 8 characters long.',
        'any.required': 'Password is required.',
      }),
    role: Joi.string()
      .valid('user', 'admin')
      .optional()
      .default('user'),
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.base': 'Email must be a string.',
        'string.empty': 'Email is required.',
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.',
      }),
    password: Joi.string()
      .required()
      .messages({
        'string.base': 'Password must be a string.',
        'string.empty': 'Password is required.',
        'any.required': 'Password is required.',
      }),
  }),
};

module.exports = userValidation;
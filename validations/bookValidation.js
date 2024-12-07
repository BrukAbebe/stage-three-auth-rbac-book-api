const Joi = require('joi');

const bookValidation = {
  createBook: Joi.object({
    title: Joi.string()
      .required()
      .messages({
        'string.base': 'Title must be a string.',
        'string.empty': 'Title is required.',
        'any.required': 'Title is required.',
      }),
    author: Joi.string()
      .required()
      .messages({
        'string.base': 'Author must be a string.',
        'string.empty': 'Author is required.',
        'any.required': 'Author is required.',
      }),
    isbn: Joi.string()
      .required()
      .messages({
        'string.base': 'ISBN must be a string.',
        'string.empty': 'ISBN is required.',
        'any.required': 'ISBN is required.',
      }),
    publishedYear: Joi.number()
      .integer()
      .required()
      .max(new Date().getFullYear())
      .messages({
        'number.base': 'Published year must be a number.',
        'number.integer': 'Published year must be an integer.',
        'number.max': 'Published year cannot be in the future.',
        'any.required': 'Published year is required.',
      }),
    averageRating: Joi.number()
      .min(0)
      .max(5)
      .optional() 
      .default(0) 
      .messages({
        'number.base': 'Average rating must be a number.',
        'number.min': 'Average rating must be at least 0.',
        'number.max': 'Average rating cannot be more than 5.',
      }),
    favorite: Joi.boolean().optional() 
  }),

  updateBook: Joi.object({
    title: Joi.string().optional().messages({
      'string.base': 'Title must be a string.',
    }),
    author: Joi.string().optional().messages({
      'string.base': 'Author must be a string.',
    }),
    isbn: Joi.string().optional().messages({
      'string.base': 'ISBN must be a string.',
    }),
    publishedYear: Joi.number()
      .integer()
      .optional()
      .max(new Date().getFullYear())
      .messages({
        'number.base': 'Published year must be a number.',
        'number.integer': 'Published year must be an integer.',
        'number.max': 'Published year cannot be in the future.',
      }),
    averageRating: Joi.number()
      .min(0)
      .max(5)
      .optional() 
      .messages({
        'number.base': 'Average rating must be a number.',
        'number.min': 'Average rating must be at least 0.',
        'number.max': 'Average rating cannot be more than 5.',
      }),
    favorite: Joi.boolean().optional() 
  }).or('title', 'author', 'isbn', 'publishedYear', 'averageRating', 'favorite'), 
};

module.exports = bookValidation;
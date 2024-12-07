const { ValidationError } = require('joi');
const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    return next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, message));
  }
  next();
};

module.exports = validate;
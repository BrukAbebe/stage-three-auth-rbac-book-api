const { StatusCodes } = require('http-status-codes');
const ApiError = require("../utils/ApiError");

const authorizeAdmin = (req, res, next) => {
  
  if (req.user && req.user.role === 'admin') {
    return next(); 
  }
  return next(new ApiError(StatusCodes.FORBIDDEN, "Forbidden: Admins only"));
};

module.exports = authorizeAdmin;
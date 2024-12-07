const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

const protect = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Access denied. No token provided."
      )
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "User not found"));
    }

    req.user.role = decoded.role;
    req.userId = decoded.id;

    next();
  } catch (error) {
    return next(
      new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired token.")
    );
  }
});

module.exports = {
  protect,
};

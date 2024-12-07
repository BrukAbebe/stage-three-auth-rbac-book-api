const { StatusCodes } = require("http-status-codes");
const authService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");

const signup = catchAsync(async (req, res) => {
  const { body } = req;
  const { user } = await authService.signup(body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});

const login = catchAsync(async (req, res) => {
  const { body } = req;
  const { user, token } = await authService.login(body);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
  });
});

module.exports = {
  signup,
  login,
};

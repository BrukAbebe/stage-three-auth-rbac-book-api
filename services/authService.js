const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const signup = async ({
  firstName,
  lastName,
  username,
  email,
  password,
  role,
}) => {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "User with this email already exists."
    );
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Username is already taken.");
  }

  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
    role: role || "user",
  });

  return { user };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password.");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password.");
  }

  const token = generateToken(user);

  return { user, token };
};

module.exports = {
  signup,
  login,
};

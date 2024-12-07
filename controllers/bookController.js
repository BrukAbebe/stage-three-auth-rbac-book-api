const mongoose = require("mongoose");
const bookService = require("../services/bookServices");
const catchAsync = require("../utils/catchAsync");
const { StatusCodes } = require("http-status-codes");

const createBook = catchAsync(async (req, res) => {
  const bookData = { ...req.body, userId: req.user.id };
  const newBook = await bookService.createBook(bookData);

  if (req.body.favorite) {
    await bookService.addFavoriteBook(req.user.id, newBook._id);
  }

  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "The book has been created successfully.",
    data: newBook,
  });
});

const getAllBooks = catchAsync(async (req, res) => {
  const books = await bookService.getAllBooks();
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "All books have been retrieved successfully.",
    data: books,
  });
});

const getUserBooks = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const books = await bookService.getUserBooks(userId);
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Your books have been retrieved successfully.",
    data: books,
  });
});

const updateBook = catchAsync(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Invalid book ID format. Please provide a valid ObjectId.",
    });
  }

  const updatedBook = await bookService.updateBook(
    req.params.id,
    req.user.id,
    req.body,
    req.user.role
  );

  if (req.body.favorite !== undefined) {
    if (req.body.favorite) {
      await bookService.addFavoriteBook(req.user.id, updatedBook._id);
    } else {
      await bookService.removeFavoriteBook(req.user.id, updatedBook._id);
    }
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "The book has been updated successfully.",
    data: updatedBook,
  });
});

const deleteBook = catchAsync(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Invalid book ID format. Please provide a valid ObjectId.",
    });
  }

  const deletedBook = await bookService.deleteBook(
    req.params.id,
    req.user.id,
    req.user.role
  );

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "The book has been deleted successfully.",
    data: deletedBook,
  });
});

const getUserFavoriteBooks = catchAsync(async (req, res) => {
  const favorites = await bookService.getUserFavoriteBooks(req.user.id);
  res.status(StatusCodes.OK).json({
    status: "success",
    message:
      favorites.length > 0
        ? "Here are your favorite books."
        : "You currently have no favorite books.",
    data: favorites,
  });
});

const getAllFavoriteBooks = catchAsync(async (req, res) => {
  const favorites = await bookService.getAllFavoriteBooks();
  res.status(StatusCodes.OK).json({
    status: "success",
    message:
      favorites.length > 0
        ? "Here are all the favorite books from all users."
        : "There are no favorite books available at this time.",
    data: favorites,
  });
});

const getBookRecommendations = catchAsync(async (req, res) => {
  const userId = req.user.id;
  let recommendations;

  if (req.user.role === "admin") {
    recommendations = await bookService.getAdminRecommendations();
  } else {
    recommendations = await bookService.getUserRecommendations(userId);
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    message: recommendations.message,
    data: recommendations.data,
  });
});

module.exports = {
  createBook,
  getAllBooks,
  getUserBooks,
  updateBook,
  deleteBook,
  getUserFavoriteBooks,
  getAllFavoriteBooks,
  getBookRecommendations,
};

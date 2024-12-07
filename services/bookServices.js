const mongoose = require("mongoose");
const Book = require("../models/Book");
const User = require("../models/User");
const Favorite = require("../models/Favorite");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");

const createBook = async (bookData) => {
  const existingBook = await Book.findOne({
    isbn: bookData.isbn,
    userId: bookData.userId,
  });

  if (existingBook) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "A book with this ISBN already exists for your account."
    );
  }

  return Book.create(bookData).catch((error) => {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Failed to create the book: " + error.message
    );
  });
};

const getAllBooks = async () => {
  return Book.find({}).catch((error) => {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to retrieve books: " + error.message
    );
  });
};

const getUserBooks = async (userId) => {
  return Book.find({ userId }).catch((error) => {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to retrieve your books: " + error.message
    );
  });
};

const updateBook = async (id, userId, updates, role) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid book ID format.");
  }

  const existingBook = await Book.findById(id);
  if (!existingBook) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "The specified book was not found."
    );
  }

  const isOwner = existingBook.userId.toString() === userId;
  if (role !== "admin" && !isOwner) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You do not have permission to update this book."
    );
  }

  if (updates.isbn && updates.isbn !== existingBook.isbn) {
    const duplicateBook = await Book.findOne({
      isbn: updates.isbn,
      userId: existingBook.userId,
    });
    if (duplicateBook) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "A book with this ISBN already exists for this user."
      );
    }
  }

  return Book.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    .then((updatedBook) => {
      if (!updatedBook) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Failed to update the book.");
      }
      return updatedBook;
    })
    .catch(() => {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "An error occurred while updating the book."
      );
    });
};

const deleteBook = async (id, userId, role) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid book ID format.");
  }

  const existingBook = await Book.findById(id);
  if (!existingBook) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "The specified book was not found."
    );
  }

  const isOwner = existingBook.userId.toString() === userId;
  if (role !== "admin" && !isOwner) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You do not have permission to delete this book."
    );
  }

  await Favorite.deleteMany({ bookId: id });
  await Book.findByIdAndDelete(id);

  return existingBook;
};

const addFavoriteBook = async (userId, bookId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found.");

  const book = await Book.findById(bookId);
  if (!book) throw new ApiError(StatusCodes.NOT_FOUND, "Book not found.");

  const favoriteExists = await Favorite.findOne({ userId, bookId });
  if (!favoriteExists) {
    await Favorite.create({ userId, bookId });
    await Book.findByIdAndUpdate(bookId, { $inc: { favoriteCount: 1 } });
  }

  return {
    message: "The book has been added to your favorites.",
    favorites: await Favorite.find({ userId }).populate("bookId"),
  };
};

const removeFavoriteBook = async (userId, bookId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found.");

  const book = await Book.findById(bookId);
  if (!book) throw new ApiError(StatusCodes.NOT_FOUND, "Book not found.");

  const favorite = await Favorite.findOneAndDelete({ userId, bookId });
  if (!favorite)
    throw new ApiError(StatusCodes.NOT_FOUND, "Favorite not found.");

  await Book.findByIdAndUpdate(bookId, { $inc: { favoriteCount: -1 } });

  return {
    message: "The book has been removed from your favorites.",
    favorites: await Favorite.find({ userId }).populate("bookId"),
  };
};

const getUserFavoriteBooks = async (userId) => {
  return Favorite.find({ userId })
    .populate("bookId")
    .exec()
    .then((userFavorites) => {
      if (!userFavorites || userFavorites.length === 0) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "No favorite books found for this user."
        );
      }
      return userFavorites.map((favorite) => favorite.bookId);
    })
    .catch((error) => {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to retrieve user favorite books: " + error.message
      );
    });
};

const getAllFavoriteBooks = async () => {
  return Favorite.find()
    .populate("bookId")
    .then((favorites) => {
      const favoriteBooks = favorites.map((favorite) => favorite.bookId);
      return [...new Set(favoriteBooks)];
    })
    .catch((error) => {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to retrieve all favorite books: " + error.message
      );
    });
};

const getAdminRecommendations = async () => {
  return Favorite.aggregate([
    {
      $lookup: {
        from: "books",
        localField: "bookId",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    { $unwind: "$bookDetails" },
    {
      $group: {
        _id: "$bookDetails.isbn",
        count: { $sum: 1 },
        bookDetails: { $first: "$bookDetails" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ])
    .then((commonFavorites) => {
      const recommendedBooks = commonFavorites.map(
        (entry) => entry.bookDetails
      );

      return {
        status: "success",
        message:
          recommendedBooks.length > 0
            ? "Top book recommendations based on the most common favorites among all users."
            : "No recommendations available at this time.",
        data: recommendedBooks,
      };
    })
    .catch((error) => {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unable to retrieve admin recommendations. " + error.message
      );
    });
};

const getUserRecommendations = async (userId) => {
  return Favorite.find({ userId })
    .populate("bookId", "isbn")
    .then((userFavorites) => {
      const favoriteISBNs = userFavorites.map((fav) => fav.bookId.isbn);

      if (favoriteISBNs.length === 0) {
        return {
          status: "success",
          message: "You have no favorite books to recommend.",
          data: [],
        };
      }

      return Favorite.aggregate([
        {
          $lookup: {
            from: "books",
            localField: "bookId",
            foreignField: "_id",
            as: "bookDetails",
          },
        },
        { $unwind: "$bookDetails" },
        {
          $match: {
            "bookDetails.isbn": { $in: favoriteISBNs },
            userId: { $ne: userId },
          },
        },
        {
          $group: {
            _id: "$bookDetails.isbn",
            bookDetails: { $first: "$bookDetails" },
          },
        },
      ]);
    })
    .then((commonFavorites) => {
      const recommendedBooks = commonFavorites.map(
        (entry) => entry.bookDetails
      );

      return {
        status: "success",
        message:
          recommendedBooks.length > 0
            ? "These books are popular favorites among you and other users based on your favorites."
            : "No new recommendations available based on your favorites.",
        data: recommendedBooks,
      };
    })
    .catch((error) => {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unable to retrieve user recommendations. " + error.message
      );
    });
};

module.exports = {
  createBook,
  getAllBooks,
  getUserBooks,
  updateBook,
  deleteBook,
  addFavoriteBook,
  removeFavoriteBook,
  getUserFavoriteBooks,
  getAllFavoriteBooks,
  getAdminRecommendations,
  getUserRecommendations,
};

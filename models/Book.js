const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      trim: true,
    },
    publishedYear: {
      type: Number,
      required: [true, "Published year is required"],
      max: [new Date().getFullYear(), "Published year cannot be in the future"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    favoriteCount: {
      type: Number,
      default: 0,

    },
  },
  { timestamps: true }
);

bookSchema.index({ isbn: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Book", bookSchema);

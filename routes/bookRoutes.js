const express = require("express");
const authController = require("../controllers/authController");
const bookController = require("../controllers/bookController");
const { protect } = require("../middlewares/authMiddleware");
const authorizeAdmin = require("../middlewares/adminMiddleware");
const validate = require("../middlewares/validate");
const bookValidation = require("../validations/bookValidation");
const router = express.Router();

router.post(
  "/",
  protect,
  validate(bookValidation.createBook),
  bookController.createBook
);
router.get("/all", protect, authorizeAdmin, bookController.getAllBooks);
router.get("/", protect, bookController.getUserBooks);
router.put(
  "/:id",
  protect,
  validate(bookValidation.updateBook),
  bookController.updateBook
);
router.delete("/:id", protect, bookController.deleteBook);
router.get("/favorites", protect, bookController.getUserFavoriteBooks);
router.get(
  "/favorites/all",
  protect,
  authorizeAdmin,
  bookController.getAllFavoriteBooks
);
router.get("/recommendations", protect, bookController.getBookRecommendations);

module.exports = router;

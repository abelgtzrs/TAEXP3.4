const express = require("express");
const router = express.Router();
// Controller functions for book management
const {
  createBook,
  getUserBooks,
  updateBook,
  deleteBook,
  markBookAsFinished,
} = require("../controllers/bookController");
// Protection middleware to ensure user is authenticated
const { protect } = require("../middleware/authMiddleware");

// Apply the protect middleware to all routes in this router
router.use(protect);

router.route("/").get(getUserBooks).post(createBook);

router
  .route("/:bookId") // This defines a URL parameter named 'bookId'
  .put(protect, updateBook)
  .delete(protect, deleteBook);

module.exports = router;

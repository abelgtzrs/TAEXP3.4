const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/financeController");

router.use(protect);

router.route("/categories").get(getCategories).post(createCategory);

router.route("/categories/:id").put(updateCategory).delete(deleteCategory);

router.route("/transactions").get(getTransactions).post(createTransaction);

router.route("/transactions/:id").put(updateTransaction).delete(deleteTransaction);

module.exports = router;

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// Import all the controller functions
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

// Apply the 'protect' middleware to all routes in this file
// This ensures only logged-in users can access their financial data.
router.use(protect);

// Category Routes
router.route("/categories").get(getCategories).post(createCategory);

router.route("/categories/:id").put(updateCategory).delete(deleteCategory);

// Transaction Routes
router.route("/transactions").get(getTransactions).post(createTransaction);

router.route("/transactions/:id").put(updateTransaction).delete(deleteTransaction);

// We will add routes for Bills, Debts, and Budgets here later.

module.exports = router;

// --- FILE: server/server.js (Add this line) ---
// Mount the new finance routes in your main server file.
// Place this line with your other app.use() statements for routes.

app.use("/api/finance", require("./routes/financeRoutes"));

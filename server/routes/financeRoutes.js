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
  getBills,
  createBill,
  updateBill,
  deleteBill,
  toggleBillPaid,
  getBudgets,
  upsertBudgets,
} = require("../controllers/financeController");

router.use(protect);

// Category Routes
router.route("/categories").get(getCategories).post(createCategory);
router.route("/categories/:id").put(updateCategory).delete(deleteCategory);

// Transaction Routes
router.route("/transactions").get(getTransactions).post(createTransaction);
router.route("/transactions/:id").put(updateTransaction).delete(deleteTransaction);

// Bill Routes
router.route("/bills").get(getBills).post(createBill);
router.route("/bills/:id").put(updateBill).delete(deleteBill);
router.put("/bills/:id/toggle-paid", toggleBillPaid);

// Budget Routes
router.route("/budgets").get(getBudgets).post(upsertBudgets);

module.exports = router;

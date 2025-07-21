const FinancialCategory = require("../models/finance/FinancialCategory");
const FinancialTransaction = require("../models/finance/FinancialTransaction");
// TODO: Add logic for Bills, Debts, and Budgets in future iterations

// CATEGORY CONTROLLERS

// Get all categories for current user, sorted alphabetically
exports.getCategories = async (req, res) => {
  try {
    const categories = await FinancialCategory.find({ user: req.user.id }).sort({ name: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create new category with optional parent for hierarchical structure
exports.createCategory = async (req, res) => {
  try {
    const { name, color, parentCategory } = req.body;
    const category = await FinancialCategory.create({
      user: req.user.id,
      name,
      color,
      parentCategory: parentCategory || null,
    });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error creating category", error: error.message });
  }
};

// Update existing category - only owner can modify
exports.updateCategory = async (req, res) => {
  try {
    let category = await FinancialCategory.findById(req.params.id);
    if (!category || category.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    category = await FinancialCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete category with ownership check
exports.deleteCategory = async (req, res) => {
  try {
    const category = await FinancialCategory.findById(req.params.id);
    if (!category || category.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    // TODO: Handle orphaned transactions - reassign to default category or set to null
    await category.remove();
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// TRANSACTION CONTROLLERS

// Get user's transactions with category details, newest first
// TODO: Add query param filtering (date range, type, category, etc.)
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await FinancialTransaction.find({ user: req.user.id })
      .populate("category", "name color") // Include category name and color
      .sort({ date: -1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create new transaction entry
exports.createTransaction = async (req, res) => {
  try {
    const { type, amount, description, category, date, account } = req.body;
    const transaction = await FinancialTransaction.create({
      user: req.user.id,
      type,
      amount,
      description,
      category,
      date,
      account,
    });
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error creating transaction", error: error.message });
  }
};

// Update transaction - verify ownership first
exports.updateTransaction = async (req, res) => {
  try {
    let transaction = await FinancialTransaction.findById(req.params.id);
    if (!transaction || transaction.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    transaction = await FinancialTransaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Remove transaction with ownership validation
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await FinancialTransaction.findById(req.params.id);
    if (!transaction || transaction.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    await transaction.remove();
    res.status(200).json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

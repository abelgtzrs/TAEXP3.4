const FinancialCategory = require("../models/finance/FinancialCategory");
const FinancialTransaction = require("../models/finance/FinancialTransaction");
const RecurringBill = require("../models/finance/RecurringBill");

// Category Controllers
exports.getCategories = async (req, res) => {
  try {
    const categories = await FinancialCategory.find({ user: req.user.id }).sort({ name: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
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
    res.status(400).json({ success: false, message: "Error creating category" });
  }
};
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
exports.deleteCategory = async (req, res) => {
  try {
    const category = await FinancialCategory.findById(req.params.id);
    if (!category || category.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    await category.deleteOne();
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Transaction Controllers
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await FinancialTransaction.find({ user: req.user.id })
      .populate("category", "name color")
      .sort({ date: -1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
exports.createTransaction = async (req, res) => {
  try {
    const transaction = await FinancialTransaction.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error creating transaction" });
  }
};
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
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await FinancialTransaction.findById(req.params.id);
    if (!transaction || transaction.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    await transaction.deleteOne();
    res.status(200).json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
exports.getBills = async (req, res) => {
  try {
    const bills = await RecurringBill.find({ user: req.user.id })
      .populate("category", "name color")
      .sort({ dueDay: 1 });
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.createBill = async (req, res) => {
  try {
    const bill = await RecurringBill.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, data: bill });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error creating bill" });
  }
};

exports.updateBill = async (req, res) => {
  try {
    let bill = await RecurringBill.findById(req.params.id);
    if (!bill || bill.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }
    bill = await RecurringBill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    const bill = await RecurringBill.findById(req.params.id);
    if (!bill || bill.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }
    await bill.deleteOne();
    res.status(200).json({ success: true, message: "Bill deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.toggleBillPaid = async (req, res) => {
  try {
    const { monthKey, isPaid } = req.body;
    const bill = await RecurringBill.findById(req.params.id);
    if (!bill || bill.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }
    if (isPaid) {
      bill.paidForMonths.addToSet(monthKey);
    } else {
      bill.paidForMonths.pull(monthKey);
    }
    await bill.save();
    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

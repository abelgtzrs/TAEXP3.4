const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinancialCategory",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    // Optional: for monthly budgets, you might add year and month fields
    // year: { type: Number, required: true },
    // month: { type: Number, required: true, min: 1, max: 12 },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only have one budget per category (and per month, if applicable)
BudgetSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Budget", BudgetSchema);

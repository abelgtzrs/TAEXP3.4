const mongoose = require("mongoose");

const FinancialTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Please provide a transaction amount"],
      min: 0.01,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinancialCategory",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    // (Suggestion from plan) To link transactions to specific accounts
    account: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FinancialTransaction", FinancialTransactionSchema);

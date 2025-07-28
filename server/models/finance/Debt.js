// server/models/finance/Debt.js
const mongoose = require("mongoose");

const DebtSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please add a name for the debt (e.g., Car Loan, Visa Card)"],
      trim: true,
    },
    initialAmount: {
      type: Number,
      required: [true, "Please add the initial debt amount"],
    },
    currentAmount: {
      type: Number,
      required: [true, "Please add the current amount owed"],
    },
    interestRate: {
      type: Number,
      default: 0,
    },
    minimumPayment: {
      type: Number,
      default: 0,
    },
    dueDate: {
      // For debts with a specific payoff date
      type: Date,
    },
    isPaidOff: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Debt", DebtSchema);

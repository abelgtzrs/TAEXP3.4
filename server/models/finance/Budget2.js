const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["weekly", "monthly"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    // A map where the key is the Category ObjectId and the value is the budgeted amount
    categoryLimits: {
      type: Map,
      of: Number,
      default: {},
    },
    overallLimit: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.FinanceBudget || mongoose.model("FinanceBudget", BudgetSchema);

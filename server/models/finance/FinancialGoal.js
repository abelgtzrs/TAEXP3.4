// server/models/finance/FinancialGoal.js
const mongoose = require("mongoose");

const FinancialGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please add a name for your goal"],
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, "Please specify a target amount for the goal"],
    },
    currentAmount: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to check if the goal is completed
FinancialGoalSchema.pre("save", function (next) {
  if (this.currentAmount >= this.targetAmount) {
    this.isCompleted = true;
  }
  next();
});

module.exports = mongoose.model("FinancialGoal", FinancialGoalSchema);

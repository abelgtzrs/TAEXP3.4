const mongoose = require("mongoose");

const FinancialCategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a category name"],
      trim: true,
    },
    color: {
      type: String,
      default: "#6B7280",
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinancialCategory",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

FinancialCategorySchema.index({ user: 1, parentCategory: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("FinancialCategory", FinancialCategorySchema);

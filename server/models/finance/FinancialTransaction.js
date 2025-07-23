const mongoose = require("mongoose");
const FinancialTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    description: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "FinancialCategory", required: true },
    date: { type: Date, required: true, default: Date.now },
    account: { type: String, trim: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("FinancialTransaction", FinancialTransactionSchema);

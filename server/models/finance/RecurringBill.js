const mongoose = require("mongoose");
const RecurringBillSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    dueDay: { type: Number, required: true, min: 1, max: 31 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "FinancialCategory", required: true },
    paidForMonths: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("RecurringBill", RecurringBillSchema);

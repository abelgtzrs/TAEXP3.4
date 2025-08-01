const mongoose = require("mongoose");

const FinancialActionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true }, // e.g. 'clear', 'add', 'edit', 'delete'
  details: { type: Object }, // Optional: store extra info (e.g. what was cleared)
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.models.FinancialActionLog || mongoose.model("FinancialActionLog", FinancialActionLogSchema);

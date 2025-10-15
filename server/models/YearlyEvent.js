const mongoose = require("mongoose");

const YearlyEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    day: { type: Number, required: true, min: 1, max: 31 },
    category: { type: String, enum: ["birthday", "anniversary", "other"], default: "other" },
    color: { type: String, default: "#10b981" }, // green by default
    notes: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("YearlyEvent", YearlyEventSchema);

const mongoose = require("mongoose");

const CalendarEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    date: { type: Date, required: true, index: true },
    allDay: { type: Boolean, default: true },
    category: { type: String, enum: ["personal", "work", "bill", "other"], default: "personal" },
    color: { type: String, default: "#4f46e5" }, // optional display color
  },
  { timestamps: true }
);

module.exports = mongoose.model("CalendarEvent", CalendarEventSchema);

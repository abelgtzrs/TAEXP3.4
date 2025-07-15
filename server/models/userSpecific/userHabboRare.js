// server/models/userSpecific/UserHabboRare.js
const mongoose = require("mongoose");

const UserHabboRareSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    habboRareBase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HabboRareBase", // References the HabboRareBase model
      required: true,
    },
    obtainedAt: {
      type: Date,
      default: Date.now,
    },
    // isDisplayed: { type: Boolean, default: false } // Handled by User.displayedHabboRares
  },
  { timestamps: true }
);

// Typically, a user owns one instance of a specific rare furniture item.
UserHabboRareSchema.index({ user: 1, habboRareBase: 1 }, { unique: true });

module.exports = mongoose.models.UserHabboRare || mongoose.model("UserHabboRare", UserHabboRareSchema);

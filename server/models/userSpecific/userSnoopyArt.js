// server/models/userSpecific/UserSnoopyArt.js
const mongoose = require("mongoose");

const UserSnoopyArtSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    snoopyArtBase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SnoopyArtBase", // References the SnoopyArtBase model
      required: true,
    },
    obtainedAt: {
      type: Date,
      default: Date.now,
    },
    // isDisplayed: { type: Boolean, default: false } // Handled by User.displayedSnoopyArt
  },
  { timestamps: true }
);

// Optional: Prevent a user from owning the exact same SnoopyArtBase item multiple times
// If duplicates are fine (e.g. for trading later), remove this.
// If each SnoopyArt piece is unique per user, keep it.
// For collectibles, usually a user owns one instance of a specific collectible type.
UserSnoopyArtSchema.index({ user: 1, snoopyArtBase: 1 }, { unique: true });

module.exports = mongoose.models.UserSnoopyArt || mongoose.model("UserSnoopyArt", UserSnoopyArtSchema);

// server/models/userSpecific/UserTitle.js
const mongoose = require("mongoose");

const UserTitleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    titleBase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TitleBase", // References the TitleBase model
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
    // The equipped status is on the User model: User.equippedTitle
  },
  { timestamps: true }
);

// A user should only earn/unlock a specific title once
UserTitleSchema.index({ user: 1, titleBase: 1 }, { unique: true });

module.exports = mongoose.model("UserTitle", UserTitleSchema);

// server/models/userSpecific/UserBadge.js
const mongoose = require("mongoose");

const UserBadgeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    badgeBase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BadgeBase", // References the BadgeBase model
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// A user should only earn a specific badge once
UserBadgeSchema.index({ user: 1, badgeBase: 1 }, { unique: true });

module.exports = mongoose.models.UserBadge || mongoose.model("UserBadge", UserBadgeSchema);

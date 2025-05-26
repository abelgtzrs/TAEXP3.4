// server/models/userSpecific/UserYugiohCard.js
const mongoose = require("mongoose");

const UserYugiohCardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    yugiohCardBase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "YugiohCardBase", // References the YugiohCardBase model
      required: true,
    },
    obtainedAt: {
      type: Date,
      default: Date.now,
    },
    quantity: {
      // Users might own multiple copies of the same card
      type: Number,
      default: 1,
      min: 1,
    },
    // isDisplayedInDeck: { type: Boolean, default: false } // If implementing deck building
  },
  { timestamps: true }
);

// A user can own multiple copies of the same card, so the (user, yugiohCardBase) pair
// should be unique to represent one "stack" of that card.
// If quantity handles multiples, then this index ensures only one document per card type per user.
UserYugiohCardSchema.index({ user: 1, yugiohCardBase: 1 }, { unique: true });

module.exports = mongoose.model("UserYugiohCard", UserYugiohCardSchema);

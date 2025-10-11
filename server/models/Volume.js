const mongoose = require("mongoose");
const { create } = require("./User");

const BlessingSchema = new mongoose.Schema(
  {
    item: { type: String, required: true, trim: true },
    // Description was required, but parser may produce blank entries (e.g., item without parentheses).
    // Make it optional with default empty string to avoid validation failures on bulk uploads.
    description: { type: String, trim: true, default: "" },
    // Optional AI guidance context for this blessing to keep lore accuracy during generation
    context: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const VolumeSchema = new mongoose.Schema(
  {
    volumeNumber: {
      type: Number,
      required: [true, "Volume number is required."],
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Volume title is required."],
      trim: true,
    },
    bodyLines: [
      {
        type: String,
      },
    ],
    blessingIntro: {
      type: String,
      trim: true,
    },
    blessings: [BlessingSchema],
    dream: {
      type: String,
      trim: true,
    },
    edition: {
      type: String,
      trim: true,
    },
    rawPastedText: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    ratings: [{ value: Number, ratedAt: Date }],
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volume", VolumeSchema);

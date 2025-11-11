// server/models/BadgeCollection.js
const mongoose = require("mongoose");

const BadgeCollectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "Collection key is required"],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Collection name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    generation: {
      type: Number,
      required: [true, "Generation is required"],
      min: 1,
    },
    totalItems: {
      type: Number,
      required: [true, "Total items is required"],
      min: 1,
    },
    order: {
      type: Number,
      default: 0,
    },
    legendaryGateNeeded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BadgeCollection", BadgeCollectionSchema);

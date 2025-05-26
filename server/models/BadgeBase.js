// server/models/BadgeBase.js
const mongoose = require("mongoose");

const BadgeBaseSchema = new mongoose.Schema(
  {
    badgeId: {
      // Unique identifier, e.g., "kanto_boulder_badge", "read_10_books"
      type: String,
      required: [true, "Please provide a unique Badge ID"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please provide the Badge name"],
      trim: true,
    },
    description: {
      // What this badge represents or how it's earned
      type: String,
      required: true,
    },
    imageUrl: {
      // URL to the badge image
      type: String,
      required: [true, "Please provide an image URL for the Badge"],
    },
    category: {
      // To group badges, e.g., "Pokémon Gen 1"
      type: String,
      required: true,
      default: "General",
    },
    series: {
      // More specific grouping within a category, e.g., "Kanto Gym Leaders", "Johto Elite Four"
      type: String,
      default: "",
    },
    orderInCategory: { type: Number }, //  for predefined display order
  },
  { timestamps: true }
);

module.exports = mongoose.model("BadgeBase", BadgeBaseSchema);

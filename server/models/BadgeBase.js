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
    spriteSmallUrl: {
      // Smaller sprite for compact UI (optional distinct from imageUrl)
      type: String,
      trim: true,
      default: "",
    },
    spriteLargeUrl: {
      // Larger detailed artwork
      type: String,
      trim: true,
      default: "",
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
    unlocksGeneration: {
      type: Number,
    },
    legendaryGate: {
      // If true, completing this badge's collection is required to unlock legendaries of its generation
      type: Boolean,
      default: false,
    },
    unlockDay: {
      // Login streak day required to unlock (multiple of 5). Example: 5,10,15...
      type: Number,
      min: 1,
      index: true,
    },
    orderInCategory: { type: Number }, //  for predefined display order
    collectionKey: {
      // Key tying badges together (e.g., 'gen1', 'gen2'). Serves as a lightweight collection.
      type: String,
      trim: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BadgeBase", BadgeBaseSchema);

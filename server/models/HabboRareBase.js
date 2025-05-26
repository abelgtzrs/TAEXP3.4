// server/models/HabboRareBase.js
const mongoose = require("mongoose");

const HabboRareBaseSchema = new mongoose.Schema(
  {
    habboRareId: {
      // Unique identifier, e.g., "throne", "hc_sofa"
      type: String,
      required: [true, "Please provide a unique Habbo Rare ID"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please provide the Habbo Rare name"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    imageUrl: {
      // URL to the pixel art image of the Habbo Rare
      type: String,
      required: [true, "Please provide an image URL for the Habbo Rare"],
    },
    // Rarity could be based on its original Habbo Hotel rarity/value or your own system
    rarityCategory: {
      type: String,
      enum: [
        "common_rare",
        "uncommon_rare",
        "rare_rare",
        "super_rare",
        "ultra_rare",
      ],
      default: "common_rare",
      required: true,
    },
    series: {
      // e.g., "V11 Rares", "Club Shop", "Seasonal"
      type: String,
      default: "General",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HabboRareBase", HabboRareBaseSchema);

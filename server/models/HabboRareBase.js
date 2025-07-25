const mongoose = require("mongoose");

const HabboRareBaseSchema = new mongoose.Schema(
  {
    habboRareId: {
      // A unique identifier, e.g., "throne", "hc_sofa"
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    imageUrl: {
      // URL to the pixel art image of the Habbo Rare
      type: String,
      required: true,
    },
    rarityCategory: {
      type: String,
      enum: ["common_rare", "uncommon_rare", "rare_rare", "super_rare", "ultra_rare"],
      default: "common_rare",
      required: true,
    },
    originalYear: {
      // Year it was prominent or released in Habbo
      type: String,
      default: "Classic",
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

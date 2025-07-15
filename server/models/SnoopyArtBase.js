// server/models/SnoopyArtBase.js
const mongoose = require("mongoose");

const SnoopyArtBaseSchema = new mongoose.Schema(
  {
    snoopyId: {
      // A unique identifier for this Snoopy art
      type: String,
      required: [true, "Please provide a unique Snoopy ID"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please provide the Snoopy art name"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    imageUrl: {
      // URL to the pixel art image
      type: String,
      required: [true, "Please provide an image URL for the Snoopy art"],
    },
    rarity: {
      type: String,
      enum: ["common", "uncommon", "rare", "epic", "legendary_snoopy"], // Added suffix to avoid conflict if a general 'legendary' rarity exists elsewhere
      default: "common",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.SnoopyArtBase || mongoose.model("SnoopyArtBase", SnoopyArtBaseSchema);

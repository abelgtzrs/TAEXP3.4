const mongoose = require("mongoose");

const AbelPersonaBaseSchema = new mongoose.Schema(
  {
    personaId: {
      // Unique identifier, e.g., "stoic_abel", "sage_abel"
      type: String,
      required: [true, "Please provide a unique Persona ID"],
      unique: true,
      trim: true,
    },
    name: {
      // Display name, e.g., "Stoic Abel", "Sage Abel"
      type: String,
      required: [true, "Please provide the Persona name"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    rarity: {
      // Rarity level, e.g., "common", "rare", "epic", "legendary"
      type: String,
      enum: ["common", "rare", "epic", "mythic", "transcendent"],
      default: "common",
    },
    themeColors: {
      // Object storing hex codes for the theme
      bg: { type: String, required: true }, // e.g., #14B8A6 (Teal)
      surface: { type: String, required: true }, // e.g., #0D9488
      primary: { type: String, required: true }, // e.g., #2DD4BF
      secondary: { type: String, required: true }, // e.g., #111827
      tertiary: { type: String, required: true }, // e.g., #E5E7EB
      text_main: { type: String, required: true }, // e.g., #9CA3AF
      text_secondary: { type: String, required: true }, // e.g., #6B7280
      text_tertiary: { type: String, required: true }, // e.g., #1F2937
      font: { type: String, default: "Inter, sans-serif" }, // Default font
    },
    iconUrlOrKey: {
      // Optional icon representing the persona
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.AbelPersonaBase || mongoose.model("AbelPersonaBase", AbelPersonaBaseSchema);

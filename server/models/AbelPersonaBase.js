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
    themeColors: {
      // Object storing hex codes for the theme
      primary: { type: String, required: true }, // e.g., #14B8A6 (Teal)
      secondary: { type: String, required: true }, // e.g., #0D9488
      accent: { type: String, required: true }, // e.g., #2DD4BF
      background: { type: String, required: true }, // e.g., #111827 (Dark Gray)
      text_primary: { type: String, required: true }, // e.g., #E5E7EB (Light Text)
      text_secondary: { type: String, required: true }, // e.g., #9CA3AF (Grayer Text)
    },
    iconUrlOrKey: {
      // Optional icon representing the persona
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AbelPersonaBase", AbelPersonaBaseSchema);

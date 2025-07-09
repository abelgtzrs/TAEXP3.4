const mongoose = require("mongoose");

const PokemonChangeLogSchema = new mongoose.Schema(
  {
    pokemonBase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PokemonBase",
      required: true,
      index: true,
    },
    adminUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // For MVP, we'll store a simple text description of the change.
    // A more advanced version could store an object with old/new values.
    changeDescription: {
      type: String,
      required: true,
      default: "General update performed.",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PokemonChangeLog", PokemonChangeLogSchema);

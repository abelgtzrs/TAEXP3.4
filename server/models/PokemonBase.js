const mongoose = require("mongoose");

const PokemonBaseSchema = new mongoose.Schema(
  {
    speciesId: {
      type: Number,
      required: [true, "Please provide a species ID (Pokédex number)"],
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Please provide the Pokémon name"],
      trim: true,
      unique: true,
    },
    generation: {
      type: Number,
      required: [true, "Please specify the generation (1-6)"],
      min: 1,
      max: 6,
    },
    types: [
      {
        // Array of strings, e.g., ["Grass", "Poison"]
        type: String,
        required: true,
      },
    ],
    isLegendary: {
      type: Boolean,
      default: false,
    },
    isMythical: {
      // Some Pokémon are Mythical, distinct from Legendary
      type: Boolean,
      default: false,
    },
    isStarter: {
      // Flag for identifying starter Pokémon for new users
      type: Boolean,
      default: false,
    },
    evolvesAtLevel: {
      // Level at which this Pokémon evolves
      type: Number,
      default: null, // Null if it doesn't evolve by level or is final stage
    },
    evolutionStage: {
      type: Number,
      required: [true, "Please specify the evolution stage (1, 2, or 3)"],
      enum: [1, 2, 3],
    },
    evolvesToSpeciesId: {
      // speciesId of the Pokémon it evolves into
      type: Number,
      default: null,
      ref: "PokemonBase", // Self-reference for evolution chain, but storing ID is fine
    },
    // spriteKey or imageUrl: You mentioned handling sprites yourself.
    // Let's use spriteKey which you can map on the frontend.
    spriteKey: {
      // e.g., "pikachu_front_default", "025"
      type: String,
      required: false, // Or true if you have them all ready
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model("PokemonBase", PokemonBaseSchema);

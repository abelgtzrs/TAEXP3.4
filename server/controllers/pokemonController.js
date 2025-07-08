// server/controllers/pokemonController.js
const PokemonBase = require("../models/PokemonBase");

// @desc    Get all base Pokémon data for the Pokédex
// @route   GET /api/pokemon/base
// @access  Private
exports.getAllBasePokemon = async (req, res) => {
  try {
    // Find all documents and sort them by their Pokédex number (speciesId)
    const pokemon = await PokemonBase.find({}).sort({ speciesId: 1 });
    res.status(200).json({ success: true, count: pokemon.length, data: pokemon });
  } catch (error) {
    console.error("Get All Base Pokemon Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

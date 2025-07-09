// server/controllers/pokemonAdminController.js
const PokemonBase = require("../models/PokemonBase");

// @desc    Get a single base Pokémon by its DB ID (for editing)
// @route   GET /api/admin/pokemon/:id
exports.getPokemonBaseById = async (req, res) => {
  try {
    const pokemon = await PokemonBase.findById(req.params.id);
    if (!pokemon) {
      return res.status(404).json({ success: false, message: "Pokémon not found" });
    }
    res.status(200).json({ success: true, data: pokemon });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update a base Pokémon
// @route   PUT /api/admin/pokemon/:id
exports.updatePokemonBase = async (req, res) => {
  try {
    const pokemon = await PokemonBase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pokemon) {
      return res.status(404).json({ success: false, message: "Pokémon not found" });
    }
    res.status(200).json({ success: true, data: pokemon });
  } catch (error) {
    console.error("Update Pokemon Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// You can add create/delete functions here later following the same pattern.

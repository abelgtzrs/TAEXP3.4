// server/routes/pokemonRoutes.js
const express = require("express");
const router = express.Router();

const { getAllBasePokemon } = require("../controllers/pokemonController");
const { protect } = require("../middleware/authMiddleware");

// Define the route. Any logged-in user can access the Pokédex data.
router.get("/base", protect, getAllBasePokemon);

module.exports = router;

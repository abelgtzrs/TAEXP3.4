// server/routes/pokemonAdminRoutes.js
const express = require("express");
const router = express.Router();
const { getPokemonBaseById, updatePokemonBase } = require("../controllers/pokemonAdminController");

// All routes in this file will be protected by the middleware in server.js
router.route("/:id").get(getPokemonBaseById).put(updatePokemonBase);

module.exports = router;

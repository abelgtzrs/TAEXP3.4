const express = require("express");
const router = express.Router();
const { getRandomSong } = require("../controllers/strokesController");

router.get("/random", getRandomSong);

module.exports = router;

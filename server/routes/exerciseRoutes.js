const express = require("express");
const router = express.Router();
const { getExerciseDefinitions } = require("../controllers/exerciseController");
const { protect } = require("../middleware/authMiddleware");

// Route for any logged-in user to get the list of available exercises.
router.get("/", protect, getExerciseDefinitions);

module.exports = router;

// server/routes/exerciseDefinitionRoutes.js

const express = require("express");
const router = express.Router();

// Import only the controller function we need.
const { getAllExerciseDefinitions } = require("../controllers/exerciseDefinitionController");

// Import only the 'protect' middleware.
const { protect } = require("../middleware/authMiddleware");

// Route to get all exercise definitions (accessible to any logged-in user).
// GET /api/exercises
router.get("/", protect, getAllExerciseDefinitions);

module.exports = router;

// server/routes/exerciseDefinitionRoutes.js

const express = require("express");
const router = express.Router();

// Import the controller functions.
const {
  createExerciseDefinition,
  getAllExerciseDefinitions,
  updateExerciseDefinition,
  deleteExerciseDefinition,
} = require("../controllers/exerciseDefinitionController"); // We will create this next.

// Import our middleware.
const { protect, authorize } = require("../middleware/authMiddleware");

// --- Route Definitions ---
// The URL prefix for these routes will be '/api/exercises' (defined in server.js).

// Route to get all exercise definitions (accessible to any logged-in user).
// Route to create a new exercise definition (admin only).
router
  .route("/")
  .get(protect, getAllExerciseDefinitions) // Any logged-in user can get the list.
  .post(protect, authorize("admin"), createExerciseDefinition); // Only admins can create.

// Routes to update or delete a specific exercise definition (admin only).
router
  .route("/:id")
  .put(protect, authorize("admin"), updateExerciseDefinition)
  .delete(protect, authorize("admin"), deleteExerciseDefinition);

module.exports = router;

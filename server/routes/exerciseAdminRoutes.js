// server/routes/exerciseAdminRoutes.js

const express = require("express");
const router = express.Router();

// Import the same controller functions.
const {
  createExerciseDefinition,
  updateExerciseDefinition,
  deleteExerciseDefinition,
} = require("../controllers/exerciseDefinitionController");

// We don't need 'protect' and 'authorize' here because we will apply them
// to the entire file when we mount it in server.js.

// Route to create a new exercise definition.
// POST /api/admin/exercises
router.post("/", createExerciseDefinition);

// Routes to update or delete a specific exercise definition.
// PUT /api/admin/exercises/:id
// DELETE /api/admin/exercises/:id
router.route("/:id").put(updateExerciseDefinition).delete(deleteExerciseDefinition);

module.exports = router;

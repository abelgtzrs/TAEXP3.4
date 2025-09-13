// server/routes/workoutTemplateRoutes.js
const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createWorkoutTemplate,
  getWorkoutTemplates,
  updateWorkoutTemplate,
  deleteWorkoutTemplate,
  // Add update/delete later if needed
} = require("../controllers/workoutTemplateController"); // We'll create this next

// Any logged-in user can get the list of templates.
router.route("/").get(protect, getWorkoutTemplates);

// Only an admin can create new templates.
router.route("/").post(protect, authorize("admin"), createWorkoutTemplate);
router
  .route("/:id")
  .put(protect, authorize("admin"), updateWorkoutTemplate)
  .delete(protect, authorize("admin"), deleteWorkoutTemplate);

module.exports = router;

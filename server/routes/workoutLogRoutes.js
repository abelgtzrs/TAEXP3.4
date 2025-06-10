const express = require("express");
const router = express.Router();
const {
  createWorkoutLog,
  getUserWorkoutLogs,
  deleteWorkoutLog,
} = require("../controllers/workoutLogController"); // We'll create this next
const { protect } = require("../middleware/authMiddleware");

// Apply 'protect' middleware to all routes in this file.
router.use(protect);

// Routes for getting the user's list of logs and creating a new one.
router.route("/").get(getUserWorkoutLogs).post(createWorkoutLog);

// Route for deleting a specific workout log.
// (We'll skip PUT/update for MVP simplicity unless you need it).
router.route("/:logId").delete(deleteWorkoutLog);

module.exports = router;

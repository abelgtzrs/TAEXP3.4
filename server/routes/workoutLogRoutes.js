const express = require("express");
const router = express.Router();

// Import the controller functions.
const {
  createWorkoutLog,
  getUserWorkoutLogs,
  getWorkoutLogById,
  updateWorkoutLog,
  deleteWorkoutLog,
  bulkImportWorkoutLogs,
} = require("../controllers/workoutLogController");

// Import the 'protect' middleware to secure all routes.
const { protect } = require("../middleware/authMiddleware");

// Apply the 'protect' middleware to all routes in this file.
router.use(protect);

// Routes for getting the user's list of logs and creating a new one.
router.route("/").get(getUserWorkoutLogs).post(createWorkoutLog);
router.post("/bulk-import", bulkImportWorkoutLogs);

// Routes for getting, updating, or deleting a specific workout log by its ID.
router.route("/:logId").get(getWorkoutLogById).put(updateWorkoutLog).delete(deleteWorkoutLog);

module.exports = router;

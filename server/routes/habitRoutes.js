// server/routes/habitRoutes.js

const express = require("express");
const router = express.Router();

const {
  createHabit,
  getUserHabits,
  getHabitById, // We will add this controller function for completeness
  updateHabit,
  deleteHabit,
  completeHabit,
} = require("../controllers/habitController");

const { protect } = require("../middleware/authMiddleware");

// Apply the 'protect' middleware to all routes in this file.
router.use(protect);

// --- NEW, REORDERED STRUCTURE ---
// We define routes from most specific to most general.

// Route for getting all habits and creating a new habit.
// GET /api/habits
// POST /api/habits
router.route("/").get(getUserHabits).post(createHabit);

// This is the most specific route involving an ID, so we place it first.
// POST /api/habits/:habitId/complete
router.post("/:habitId/complete", completeHabit);

// These routes all work on a specific habit ID and are less specific than the '/complete' route.
// GET /api/habits/:habitId
// PUT /api/habits/:habitId
// DELETE /api/habits/:habitId
router
  .route("/:habitId")
  .get(getHabitById) // Good practice to have a route to get a single item
  .put(updateHabit)
  .delete(deleteHabit);

module.exports = router;

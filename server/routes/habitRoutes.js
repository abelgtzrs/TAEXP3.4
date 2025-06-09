// Importing Express framework and create router instance
const express = require("express");
const router = express.Router();

// Importing controller fucntions
const {
  createHabit,
  getUserHabits,
  updateHabit,
  deleteHabit,
  completeHabit,
} = require("../controllers/habitController");

// Importing protection middleware
const { protect } = require("../middleware/authMiddleware");

// Route to get all habits for the logged-in user and create a new habit.
// GET /api/habits -> getUserHabits
// POST /api/habits -> createHabit
router.route("/").get(protect, getUserHabits).post(protect, createHabit);

// Route to update or delete a specific habit by its ID.
// PUT /api/habits/some_habit_id -> updateHabit
// DELETE /api/habits/some_habit_id -> deleteHabit
router
  .route("/:habitID")
  .put(protect, updateHabit)
  .delete(protect, deleteHabit);

// Route to mark a habit as complete, triggering rewards.
// POST /api/habits/some_habit_id/complete -> completeHabit
router.post("/:habitID/complete", protect, completeHabit);

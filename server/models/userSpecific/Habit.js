// server/models/userSpecific/Habit.js
const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, "Please provide a name for the habit"],
    trim: true,
  },
  description: {
    // Optional more detailed description of the habit
    type: String,
    trim: true,
    default: "",
  },
  streak: {
    // Current consecutive days this habit has been completed
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  // To track completions, we might store a list of completion dates
  // or just the last completed date to help determine streak logic.
  lastCompletedDate: {
    type: Date,
  },
  // Alternatively, to track specific completions and prevent multiple completions per day:
  // completions: [{
  //     date: { type: Date, required: true },
  //     notes: String // Optional notes for that specific completion
  // }],
  // For MVP, lastCompletedDate and streak fields are simpler.
  // The daily cap for earning TemuTokens (max 10 per day from habits)
  // will be handled in the backend logic when a habit is marked complete.
  // It won't be stored directly on the habit itself, but rather checked against
  // total habit completions for the user on that day.

  // colorOrIcon: { type: String } // Optional for UI customization
  // targetFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' }
  // targetDaysOfWeek: [String] // If weekly, e.g., ["Monday", "Wednesday", "Friday"]

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    // To know when the habit was last modified or its streak updated
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` timestamp on save
HabitSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Habit", HabitSchema);

// server/models/userSpecific/WorkoutLog.js

const mongoose = require("mongoose");

// First, we define a sub-schema for a single exercise performed during a workout.
// This is not a separate model, but a blueprint for objects inside the WorkoutLog's 'exercises' array.
const ExercisePerformanceSchema = new mongoose.Schema(
  {
    // A reference to the base definition of the exercise performed.
    exerciseDefinition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExerciseDefinition",
      required: true,
    },
    // For strength exercises: an array of sets.
    sets: [
      {
        reps: { type: Number },
        weight: { type: Number },
        weightUnit: { type: String, enum: ["kg", "lbs"], default: "kg" },
      },
    ],
    // For cardio exercises:
    distance: { type: Number },
    distanceUnit: { type: String, enum: ["km", "miles"] },
    durationMinutes: { type: Number }, // Duration for this specific exercise
  },
  { _id: false }
); // We set _id to false as we don't need a separate ID for each exercise performance in the array.

// Now, we define the main schema for the entire workout log.
const WorkoutLogSchema = new mongoose.Schema(
  {
    // Link to the user who performed the workout.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // The date the workout was performed.
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    // An optional name for the workout session, e.g., "Morning Chest Day".
    workoutName: {
      type: String,
      trim: true,
      default: "Workout Session",
    },
    // The total duration of the entire workout session in minutes.
    durationSessionMinutes: {
      type: Number,
      min: 0,
    },
    // An array of all the exercises performed during this session.
    // Each object in this array will follow the structure of ExercisePerformanceSchema.
    exercises: [ExercisePerformanceSchema],
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt.

// Export the model. This will correspond to a 'workoutlogs' collection in MongoDB.
module.exports = mongoose.model("WorkoutLog", WorkoutLogSchema);

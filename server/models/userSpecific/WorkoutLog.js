// server/models/userSpecific/WorkoutLog.js
const mongoose = require("mongoose");

const ExercisePerformanceSchema = new mongoose.Schema(
  {
    exerciseDefinition: {
      // Reference to the base definition of the exercise
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExerciseDefinition",
      required: true,
    },
    // For strength exercises
    sets: [
      {
        reps: { type: Number, min: 0 },
        weight: { type: Number, min: 0 },
        weightUnit: {
          type: String,
          enum: ["kg", "lbs", "bodyweight", "band"],
          default: "kg",
        },
        notes: String, // e.g., "Warm-up set", "Drop set"
      },
    ],
    // For cardio exercises
    distance: { type: Number, min: 0 },
    distanceUnit: { type: String, enum: ["km", "miles", "meters", "laps"] },
    durationExerciseMinutes: { type: Number, min: 0 }, // Duration for this specific exercise

    // General
    caloriesBurned: { type: Number, min: 0 }, // Estimated, optional
    notes: String, // Notes for this specific exercise performance in the log
  },
  { _id: false }
); // Don't create separate _id for subdocuments unless needed

const WorkoutLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      // When the workout was performed
      type: Date,
      default: Date.now,
      required: true,
    },
    workoutName: {
      // Optional name for the session, e.g., "Morning Chest Day"
      type: String,
      trim: true,
      default: "Workout Session",
    },
    durationSessionMinutes: {
      // Total duration of the entire workout session
      type: Number,
      min: 0,
    },
    exercises: [ExercisePerformanceSchema], // Array of exercises performed in this session
    overallFeeling: {
      // Optional user rating of the session
      type: String,
      enum: ["great", "good", "okay", "meh", "tough", "exhausted"],
    },
    notesSession: {
      // General notes for the entire workout session
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt

module.exports = mongoose.model("WorkoutLog", WorkoutLogSchema);

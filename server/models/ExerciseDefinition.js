// server/models/ExerciseDefinition.js
const mongoose = require("mongoose");

const ExerciseDefinitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the exercise name"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    muscleGroups: [
      {
        // e.g., "Chest", "Triceps", "Biceps", "Quads", "Hamstrings", "Full Body"
        type: String,
        trim: true,
      },
    ],
    exerciseType: {
      type: String,
      enum: ["strength", "cardio", "flexibility", "plyometrics", "custom"],
      required: [true, "Please specify the type of exercise"],
    },
    // Default metrics expected for this exercise type (can be overridden in WorkoutLog)
    // This helps the UI suggest relevant fields when logging.
    defaultMetrics: [
      {
        name: { type: String, required: true }, // e.g., "weight", "reps", "sets", "distance", "duration"
        unit: { type: String, required: true }, // e.g., "kg", "lbs", "count", "km", "miles", "minutes"
      },
    ],
    equipmentNeeded: [
      {
        // e.g., "Barbell", "Dumbbells", "Treadmill", "Bodyweight"
        type: String,
        trim: true,
      },
    ],
    iconKey: {
      // Optional: for a small icon in the UI
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExerciseDefinition", ExerciseDefinitionSchema);

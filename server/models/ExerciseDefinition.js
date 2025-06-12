// server/models/ExerciseDefinition.js

// Import the mongoose library to create our schema and model.
const mongoose = require("mongoose");

// Create a new schema object. This is the blueprint for our Exercise Definition documents.
const ExerciseDefinitionSchema = new mongoose.Schema(
  {
    // --- Fields based on your request ---

    // The name of the exercise, e.g., "Bench Press", "Running".
    name: {
      type: String,
      required: [true, "Please provide the exercise name"],
      unique: true, // Each exercise name should be unique.
      trim: true,
    },

    // A detailed description with tips and indications.
    description: {
      type: String,
      default: "",
    },

    // The primary category of the exercise. 'enum' restricts this field to the given values.
    exerciseType: {
      type: String,
      required: true,
      enum: ["Strength", "Cardio", "Flexibility"], // Using the values you provided.
    },

    // An array of strings to specify which muscle groups are targeted.
    muscleGroups: [
      {
        type: String,
        trim: true,
        // Using an enum here can help standardize the data.
        enum: [
          "Chest",
          "Triceps",
          "Biceps",
          "Back",
          "Shoulders",
          "Quads",
          "Hamstrings",
          "Core",
          "Glutes",
          "Calves",
          "Forearms",
          "Full Body",
        ],
      },
    ],

    // --- Handling Metrics ---
    // This field defines the *template* of what metrics to track for this exercise.
    // The actual values (e.g., 100kg for 8 reps) will be stored in the 'WorkoutLog'.
    // This helps the UI know which input fields to show the user.
    defaultMetrics: [
      {
        // e.g., 'weight', 'reps', 'sets', 'distance', 'duration'
        name: { type: String, required: true },
        // e.g., 'kg', 'lbs', 'count', 'km', 'miles', 'minutes'
        unit: { type: String, required: true },
      },
    ],

    // An array of strings to specify required equipment.
    equipment: [
      {
        type: String,
        trim: true,
        enum: [
          "Machine",
          "Cables",
          "Dumbbell",
          "Barbell",
          "EZ Bar",
          "Kettlebell",
          "Bodyweight",
          "Treadmill",
          "Bike",
          "Resistance Band",
        ],
      },
    ],

    // A string key that the frontend can use to map to an actual icon component or image file.
    iconKey: {
      type: String,
      trim: true,
      default: "default_workout_icon",
    },
  },
  {
    // This Mongoose option automatically adds `createdAt` and `updatedAt` fields.
    timestamps: true,
  }
);

// Compile the schema into a model named 'ExerciseDefinition' and export it.
// This will correspond to an 'exercisedefinitions' collection in MongoDB.
module.exports = mongoose.model("ExerciseDefinition", ExerciseDefinitionSchema);

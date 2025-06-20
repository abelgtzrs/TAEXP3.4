// server/models/WorkoutTemplate.js
const mongoose = require("mongoose");

const WorkoutTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for the workout template"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "A prebuilt workout routine.",
    },
    // This is an array of references to the exercises included in this template.
    exercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExerciseDefinition",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkoutTemplate", WorkoutTemplateSchema);

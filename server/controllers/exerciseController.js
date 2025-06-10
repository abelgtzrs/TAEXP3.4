const ExerciseDefinition = require("../models/ExerciseDefinition");

// @desc    Get all exercise definitions
// @route   GET /api/exercises
exports.getExerciseDefinitions = async (req, res) => {
  try {
    // Find all exercise definitions. The frontend will use this to populate dropdowns.
    const exercises = await ExerciseDefinition.find({}).sort({ name: 1 }); // Sort alphabetically
    res
      .status(200)
      .json({ success: true, count: exercises.length, data: exercises });
  } catch (error) {
    console.error("Get Exercise Definitions Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

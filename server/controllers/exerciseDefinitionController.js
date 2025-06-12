// server/controllers/exerciseDefinitionController.js

const ExerciseDefinition = require("../models/ExerciseDefinition"); // Import the model.

// @desc    Get all exercise definitions
// @route   GET /api/exercises
// @access  Private (for any logged-in user)
exports.getAllExerciseDefinitions = async (req, res) => {
  try {
    // Find all documents and sort them alphabetically by name.
    const exercises = await ExerciseDefinition.find().sort({ name: 1 });
    res
      .status(200)
      .json({ success: true, count: exercises.length, data: exercises });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Create a new exercise definition
// @route   POST /api/exercises
// @access  Private (Admin only)
exports.createExerciseDefinition = async (req, res) => {
  try {
    // Create a new document using the data from the request body.
    const exercise = await ExerciseDefinition.create(req.body);
    res.status(201).json({ success: true, data: exercise });
  } catch (error) {
    // Handle potential errors, like validation or duplicate names.
    if (error.code === 11000) {
      // Duplicate key error
      return res
        .status(400)
        .json({
          success: false,
          message: "An exercise with this name already exists.",
        });
    }
    res
      .status(400)
      .json({
        success: false,
        message: "Error creating exercise definition",
        error: error.message,
      });
  }
};

// @desc    Update an exercise definition
// @route   PUT /api/exercises/:id
// @access  Private (Admin only)
exports.updateExerciseDefinition = async (req, res) => {
  try {
    // Find the document by its ID and update it with the new data.
    const exercise = await ExerciseDefinition.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the modified document.
        runValidators: true, // Ensure updates follow schema rules.
      }
    );

    if (!exercise) {
      return res
        .status(404)
        .json({ success: false, message: "Exercise definition not found" });
    }

    res.status(200).json({ success: true, data: exercise });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete an exercise definition
// @route   DELETE /api/exercises/:id
// @access  Private (Admin only)
exports.deleteExerciseDefinition = async (req, res) => {
  try {
    const exercise = await ExerciseDefinition.findById(req.params.id);

    if (!exercise) {
      return res
        .status(404)
        .json({ success: false, message: "Exercise definition not found" });
    }

    // Before deleting, you might consider what happens if a 'WorkoutLog' currently references this exercise.
    // For now, we will allow the deletion.
    await exercise.remove();

    res
      .status(200)
      .json({
        success: true,
        message: "Exercise definition deleted",
        data: {},
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

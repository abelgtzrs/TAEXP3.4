const WorkoutLog = require("../models/userSpecific/WorkoutLog");
const User = require("../models/User");

// @desc    Create a new workout log
// @route   POST /api/workouts
exports.createWorkoutLog = async (req, res) => {
  try {
    // --- Reward Logic ---
    // The reward is based on the number of *distinct exercises* logged.
    const numberOfExercises = req.body.exercises
      ? req.body.exercises.length
      : 0;

    if (numberOfExercises === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "A workout log must contain at least one exercise.",
        });
    }

    const GATILLA_GOLD_PER_EXERCISE = 1; // You can configure this
    const WORKOUT_XP_AWARD = 25; // Base XP for logging a workout

    const totalGoldAward = numberOfExercises * GATILLA_GOLD_PER_EXERCISE;
    const totalXPAward = WORKOUT_XP_AWARD * numberOfExercises; // XP scales with effort!

    // --- Create Workout Log ---
    // Add the user's ID to the request data before creating the document.
    req.body.user = req.user.id;
    const workoutLog = await WorkoutLog.create(req.body);

    // --- Update User with Rewards ---
    const user = await User.findById(req.user.id);
    user.gatillaGold = (user.gatillaGold || 0) + totalGoldAward;
    user.experience = (user.experience || 0) + totalXPAward;

    // Check for level up
    if (user.experience >= user.xpToNextLevel) {
      user.level += 1;
      user.experience -= user.xpToNextLevel;
      user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.25);
    }

    await user.save();

    // Send a success response.
    res.status(201).json({
      success: true,
      message: `Workout logged! +${totalXPAward} XP, +${totalGoldAward} Gatilla Gold!`,
      data: workoutLog,
    });
  } catch (error) {
    console.error("Create Workout Log Error:", error);
    res
      .status(400)
      .json({
        success: false,
        message: "Error creating workout log",
        error: error.message,
      });
  }
};

// @desc    Get all workout logs for the logged-in user
// @route   GET /api/workouts
exports.getUserWorkoutLogs = async (req, res) => {
  try {
    // Find all logs belonging to the user and populate the exercise definition details.
    const logs = await WorkoutLog.find({ user: req.user.id })
      .populate("exercises.exerciseDefinition", "name muscleGroups") // This replaces the ID with the name/muscles from the ExerciseDefinition model!
      .sort({ date: -1 }); // Sort by most recent date first

    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error("Get User Workout Logs Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a workout log
// @route   DELETE /api/workouts/:logId
exports.deleteWorkoutLog = async (req, res) => {
  try {
    const log = await WorkoutLog.findById(req.params.logId);

    if (!log) {
      return res
        .status(404)
        .json({ success: false, message: "Workout log not found" });
    }

    // Security Check: Ensure user owns this log.
    if (log.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    await log.remove();
    res
      .status(200)
      .json({ success: true, message: "Workout log deleted", data: {} });
  } catch (error) {
    console.error("Delete Workout Log Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

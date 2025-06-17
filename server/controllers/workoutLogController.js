// server/controllers/workoutLogController.js

const WorkoutLog = require("../models/userSpecific/WorkoutLog"); // Import the WorkoutLog model.
const User = require("../models/User"); // Import User model for rewards.

// @desc    Create a new workout log
// @route   POST /api/workouts
exports.createWorkoutLog = async (req, res) => {
  try {
    // --- Prepare the Log Data ---
    // Get the workout data from the request body.
    const {
      date,
      workoutName,
      durationSessionMinutes,
      exercises,
      overallFeeling,
      notesSession,
    } = req.body;

    // Check if there are any exercises in the log.
    if (!exercises || exercises.length === 0) {
      return res.status(400).json({
        success: false,
        message: "A workout log must contain at least one exercise.",
      });
    }

    // --- Reward Logic ---
    // As per our rule: 1 Gatilla Gold per exercise logged.
    const GATILLA_GOLD_AWARD = exercises.length;
    const XP_AWARD = 15 * exercises.length; // Example: 15 XP per exercise.

    // Find the user to give them their reward.
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (typeof user.xpToNextLevel !== "number" || isNaN(user.xpToNextLevel)) {
      user.xpToNextLevel = 100;
    }
    // Add the rewards.
    user.gatillaGold = (user.gatillaGold || 0) + GATILLA_GOLD_AWARD;
    user.experience = (user.experience || 0) + XP_AWARD;

    // Check for user level up.
    if (user.experience >= user.xpToNextLevel) {
      user.level += 1;
      user.experience -= user.xpToNextLevel;
      user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.25);
    }

    // --- Save to Database ---
    // Create the new workout log document.
    const newLog = await WorkoutLog.create({
      user: req.user.id, // Associate the log with the logged-in user.
      date,
      workoutName,
      durationSessionMinutes,
      exercises, // This is the array of exercise subdocuments.
      overallFeeling,
      notesSession,
    });

    // Save the updated user document with new currency and XP.
    await user.save();

    // Send a successful response.
    res.status(201).json({
      success: true,
      message: `Workout logged! +${XP_AWARD} XP, +${GATILLA_GOLD_AWARD} Gatilla Gold!`,
      data: newLog,
    });
  } catch (error) {
    console.error("Create Workout Log Error:", error);
    res.status(400).json({
      success: false,
      message: "Error creating workout log",
      error: error.message,
    });
  }
};

// --- Other CRUD Functions (Get, Update, Delete) ---

// @desc    Get all workout logs for a user
// @route   GET /api/workouts
exports.getUserWorkoutLogs = async (req, res) => {
  try {
    // Find all logs for the user, sort by most recent date.
    // .populate() will replace the exerciseDefinition ObjectId with the actual document from the ExerciseDefinition collection.
    const logs = await WorkoutLog.find({ user: req.user.id })
      .populate("exercises.exerciseDefinition", "name exerciseType") // Populate name and type of exercise
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get a single workout log by ID
// @route   GET /api/workouts/:logId
exports.getWorkoutLogById = async (req, res) => {
  try {
    const log = await WorkoutLog.findById(req.params.logId).populate(
      "exercises.exerciseDefinition"
    ); // Populate with full exercise details

    if (!log || log.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ success: false, message: "Workout log not found" });
    }

    res.status(200).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update a workout log
// @route   PUT /api/workouts/:logId
exports.updateWorkoutLog = async (req, res) => {
  // Note: Updating a log does not typically re-award currency/XP.
  try {
    let log = await WorkoutLog.findById(req.params.logId);

    if (!log || log.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ success: false, message: "Workout log not found" });
    }

    log = await WorkoutLog.findByIdAndUpdate(req.params.logId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a workout log
// @route   DELETE /api/workouts/:logId
exports.deleteWorkoutLog = async (req, res) => {
  // Note: Deleting a log should ideally also reverse any awards, but that is complex.
  // For MVP, we will just delete the log.
  try {
    const log = await WorkoutLog.findById(req.params.logId);

    if (!log || log.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ success: false, message: "Workout log not found" });
    }

    await log.remove();
    res
      .status(200)
      .json({ success: true, message: "Workout log deleted", data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

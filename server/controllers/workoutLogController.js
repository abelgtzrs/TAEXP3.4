// server/controllers/workoutLogController.js

const WorkoutLog = require("../models/userSpecific/WorkoutLog"); // Import the WorkoutLog model.
const User = require("../models/User"); // Import User model for rewards.

// @desc    Create a new workout log
// @route   POST /api/workouts
exports.createWorkoutLog = async (req, res) => {
  try {
    const {
      date,
      workoutName,
      durationSessionMinutes,
      exercises,
      overallFeeling,
      notesSession,
    } = req.body;

    if (!exercises || exercises.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "A workout log must contain at least one exercise.",
        });
    }

    // --- NEW REWARD LOGIC ---
    let totalGatillaGoldAwarded = 0;
    const XP_PER_SET = 5; // Example: 5 XP per set logged

    // Iterate over each exercise in the logged workout
    for (const exercise of exercises) {
      // Check if 'sets' exists and is an array
      if (exercise.sets && Array.isArray(exercise.sets)) {
        const numSets = exercise.sets.length;
        let goldForThisExercise = 0;

        if (numSets === 1) {
          goldForThisExercise = 1;
        } else if (numSets === 2) {
          goldForThisExercise = 3;
        } else if (numSets >= 3) {
          // Baseline for 3 sets is 5 gold
          goldForThisExercise = 5;
          // Add 1 gold for each extra set beyond 3
          if (numSets > 3) {
            goldForThisExercise += numSets - 3;
          }
        }
        totalGatillaGoldAwarded += goldForThisExercise;
      }
    }

    // Calculate total XP based on the number of sets across all exercises
    const totalSets = exercises.reduce(
      (acc, curr) => acc + (curr.sets ? curr.sets.length : 0),
      0
    );
    const totalXpAwarded = totalSets * XP_PER_SET;

    // Find the user to give them their reward.
    const user = await User.findById(req.user.id);

    // Add the rewards.
    user.gatillaGold += totalGatillaGoldAwarded;
    user.experience += totalXpAwarded;

    // Check for user level up.
    if (user.experience >= user.xpToNextLevel) {
      user.level += 1;
      user.experience -= user.xpToNextLevel;
      user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.25);
    }

    // --- Save to Database ---
    const newLog = await WorkoutLog.create({
      user: req.user.id,
      date,
      workoutName,
      durationSessionMinutes,
      exercises,
      overallFeeling,
      notesSession,
    });
    await user.save();

    // Send a successful response.
    res.status(201).json({
      success: true,
      message: `Workout logged! +${totalXpAwarded} XP, +${totalGatillaGoldAwarded} Gatilla Gold!`,
      data: newLog,
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

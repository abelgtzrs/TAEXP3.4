// Import database models.
const Habit = require("../models/userSpecific/Habit");
const User = require("../models/User");

/**
 * Checks if a date is today.
 * @param {Date} someDate - The date to check.
 * @returns {boolean} True if the date is today, false otherwise.
 */
const isToday = (someDate) => {
  if (!someDate) return false;
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Checks if a given date was the same calendar day as yesterday.
 * @param {Date} someDate - The date to check.
 * @returns {boolean} - True if the date was yesterday, otherwise false.
 */
const wasYesterday = (someDate) => {
  if (!someDate) return false;
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1); // Set the date to one day before today.
  return (
    someDate.getDate() === yesterday.getDate() &&
    someDate.getMonth() === yesterday.getMonth() &&
    someDate.getFullYear() === yesterday.getFullYear()
  );
};

exports.createHabit = async (req, res) => {
  try {
    // Create new habit document in the DB
    const habit = await Habit.create({
      user: req.user.id,
      name: req.body.name,
      description: req.body.description,
    });
    res.status(201).json({ success: true, data: habit });
  } catch (error) {
    console.error("Create Habit Error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create habit",
      error: error.message,
    });
  }
};

exports.getUserHabits = async (req, res) => {
  try {
    // Find all habits in the database where the 'user' field matches the ID of the currently logged-in user.
    const habits = await Habit.find({ user: req.user.id }).sort({
      createdAt: -1,
    }); // Sort by newest first.

    // Send a 200 OK status with the user's habits.
    res.status(200).json({ success: true, count: habits.length, data: habits });
  } catch (error) {
    // If an error occurs, send a server error response.
    console.error("Get User Habits Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// @desc    Update an existing habit
// @route   PUT /api/habits/:habitId
exports.updateHabit = async (req, res) => {
  try {
    // Find the habit by its unique ID from the URL parameter.
    let habit = await Habit.findById(req.params.habitId);

    if (!habit) {
      return res
        .status(404)
        .json({ success: false, message: "Habit not found" });
    }

    // SECURITY CHECK: Make sure the logged-in user owns this habit.
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this habit",
      });
    }

    // Update the habit with new data from the request body.
    // 'new: true' returns the modified document instead of the original.
    // 'runValidators: true' ensures any updates still adhere to our schema rules.
    habit = await Habit.findByIdAndUpdate(req.params.habitId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: habit });
  } catch (error) {
    console.error("Update Habit Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// @desc    Delete a habit
// @route   DELETE /api/habits/:habitId
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.habitId);

    if (!habit) {
      return res
        .status(404)
        .json({ success: false, message: "Habit not found" });
    }

    // SECURITY CHECK: Make sure the logged-in user owns this habit.
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this habit",
      });
    }

    // Remove the habit from the database.
    await habit.remove();

    res
      .status(200)
      .json({ success: true, message: "Habit deleted successfully", data: {} });
  } catch (error) {
    console.error("Delete Habit Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// @desc    Mark a habit as complete and give rewards
// @route   POST /api/habits/:habitId/complete
exports.completeHabit = async (req, res) => {
  try {
    // Find the habit and the user who is completing it.
    const habit = await Habit.findById(req.params.habitId);
    const user = await User.findById(req.user.id);

    if (!habit) {
      return res
        .status(404)
        .json({ success: false, message: "Habit not found" });
    }

    // SECURITY CHECK: User must own the habit.
    if (habit.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    // Prevent completing the same habit multiple times in one day.
    if (isToday(habit.lastCompletedDate)) {
      return res
        .status(400)
        .json({ success: false, message: "Habit already completed today" });
    }

    // --- Update Streak Logic ---
    if (wasYesterday(habit.lastCompletedDate)) {
      habit.streak += 1; // Continue the streak.
    } else {
      habit.streak = 1; // Start a new streak.
    }

    // Update longest streak if the current one is greater.
    if (habit.streak > habit.longestStreak) {
      habit.longestStreak = habit.streak;
    }

    // Set the last completed date to now.
    habit.lastCompletedDate = new Date();

    // --- Reward Logic ---
    const XP_AWARD = 10;
    const TEMU_TOKENS_AWARD = 1;
    // Daily token cap will be handled later for simplicity, but this is where it would go.

    // Award currency and experience points.
    user.temuTokens += TEMU_TOKENS_AWARD;
    user.experience += XP_AWARD;

    // Check if the user leveled up.
    if (user.experience >= user.xpToNextLevel) {
      user.level += 1;
      user.experience -= user.xpToNextLevel; // Subtract the XP needed for the level up.
      user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.25); // Increase XP for the next level.
    }

    // Save the updated information for both the habit and the user to the database.
    await habit.save();
    await user.save();

    // Send a successful response with the updated data.
    res.status(200).json({
      success: true,
      message: `Habit completed! +${XP_AWARD} XP, +${TEMU_TOKENS_AWARD} Temu Tokens.`,
      data: habit,
    });
  } catch (error) {
    console.error("Complete Habit Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

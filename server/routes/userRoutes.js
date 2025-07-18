// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();

const {
  getUserCollection,
  updateDisplayedItems,
  getDashboardStats,
  setActivePersona, // <-- IMPORT NEW FUNCTION
} = require("../controllers/userController"); // We'll add this function next

const { protect } = require("../middleware/authMiddleware");

// Apply 'protect' middleware to all routes in this file
router.use(protect);

// --- ADD THIS NEW ROUTE ---
router.put("/me/profile/active-persona", setActivePersona);

// Temporary route to unlock all personas for testing
router.post("/me/test/unlock-personas", async (req, res) => {
  try {
    const User = require("../models/User");
    const AbelPersonaBase = require("../models/AbelPersonaBase");

    // Get all personas
    const allPersonas = await AbelPersonaBase.find({});
    const personaIds = allPersonas.map((p) => p._id);

    // Update user to have all personas unlocked
    await User.findByIdAndUpdate(req.user.id, {
      unlockedAbelPersonas: personaIds,
    });

    res.json({ success: true, message: `Unlocked ${personaIds.length} personas for testing` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// It should be placed before any routes with URL parameters if possible, for clarity.
router.get("/me/dashboard-stats", getDashboardStats);

// Existing routes
router.get("/me/collection/:type", getUserCollection);
router.put("/me/profile/display", updateDisplayedItems);

module.exports = router;

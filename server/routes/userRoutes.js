// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();

const {
  getUserCollection,
  updateDisplayedItems,
  getDashboardStats, // <-- IMPORT NEW FUNCTION
} = require("../controllers/userController"); // We'll add this function next

const { protect } = require("../middleware/authMiddleware");

// Apply 'protect' middleware to all routes in this file
router.use(protect);

// --- ADD THIS NEW ROUTE ---
// It should be placed before any routes with URL parameters if possible, for clarity.
router.get("/me/dashboard-stats", getDashboardStats);

// Existing routes
router.get("/me/collection/:type", getUserCollection);
router.put("/me/profile/display", updateDisplayedItems);

module.exports = router;

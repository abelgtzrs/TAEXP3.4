// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();

const { getUserCollection, updateDisplayedItems } = require("../controllers/userController"); // We'll create this next

const { protect } = require("../middleware/authMiddleware");

// Apply 'protect' middleware to all routes in this file
router.use(protect);

// Route to get a user's full collection of a specific type
// e.g., GET /api/users/me/collection/pokemon
router.get("/me/collection/:type", getUserCollection);

// Route to update the array of displayed items for a collection type
// e.g., PUT /api/users/me/profile/display
router.put("/me/profile/display", updateDisplayedItems);

module.exports = router;

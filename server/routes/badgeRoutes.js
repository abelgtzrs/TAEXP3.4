// server/routes/badgeRoutes.js
const express = require("express");
const router = express.Router();

const { getAllBaseBadges } = require("../controllers/badgeController");
const { protect } = require("../middleware/authMiddleware");

// Any logged-in user can fetch the list of all possible badges.
router.get("/base", protect, getAllBaseBadges);

module.exports = router;

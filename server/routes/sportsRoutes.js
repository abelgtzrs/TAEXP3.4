const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getRealMadridAggregate, getRealMadridLive } = require("../controllers/sportsController");

// Aggregate Real Madrid data (protected like other personal analytics)
router.get("/football/real-madrid", protect, getRealMadridAggregate);
router.get("/football/real-madrid/live", protect, getRealMadridLive);

module.exports = router;

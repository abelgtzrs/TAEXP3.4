const express = require("express");
const router = express.Router();
const {
  getSpotifyAuthUrl,
  handleSpotifyCallback,
  getCurrentlyPlaying,
  syncRecentTracks,
} = require("../controllers/spotifyController");
const { protect } = require("../middleware/authMiddleware");

// This route doesn't need 'protect' as it handles the callback with a state param
router.get("/callback", handleSpotifyCallback);

// These routes require the user to be logged into our app first
router.get("/login", protect, getSpotifyAuthUrl);
router.get("/currently-playing", protect, getCurrentlyPlaying);
router.post("/sync", protect, syncRecentTracks);

module.exports = router;

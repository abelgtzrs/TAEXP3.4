const mongoose = require("mongoose");

const SpotifyLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    trackId: {
      type: String,
      required: true,
    },
    trackName: {
      type: String,
      required: true,
    },
    artistName: {
      type: String,
      required: true,
    },
    albumName: {
      type: String,
    },
    playedAt: {
      type: Date,
      required: true,
    },
    durationMs: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent logging the same song played at the exact same second for a user.
SpotifyLogSchema.index({ user: 1, trackId: 1, playedAt: 1 }, { unique: true });

module.exports = mongoose.model("SpotifyLog", SpotifyLogSchema);

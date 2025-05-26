// server/models/userSpecific/MediaItem.js
const mongoose = require("mongoose");

const MediaItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    mediaType: {
      type: String,
      enum: ["show", "movie", "game"], // Books have their own dedicated model now
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide the title"],
      trim: true,
    },
    // For Shows: e.g., "Netflix", "HBO Max"; For Games: e.g., "PC", "PS5", "Nintendo Switch"
    platformOrNetwork: {
      type: String,
      trim: true,
    },
    // For Shows: "Creator/Showrunner"; For Movies: "Director"; For Games: "Developer/Publisher"
    creatorOrDeveloper: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "backlog", // General term for to-watch/to-play
        "watching", // For shows
        "playing", // For games
        "on-hold",
        "dropped",
        "completed", // For movies, shows (entire series), games
        "watched", // Specifically for movies, or can use completed
      ],
      default: "backlog",
    },
    userRating: {
      // User's rating, e.g., 1-5 or 1-10
      type: Number,
      min: 1,
      max: 10,
    },
    notes: {
      // Personal thoughts or notes
      type: String,
      trim: true,
      default: "",
    },
    // Progress (more flexible for different types)
    // For Shows:
    currentSeason: { type: Number, min: 1 },
    currentEpisode: { type: Number, min: 1 },
    // For Games:
    // hoursPlayed: { type: Number, min: 0 },
    // percentComplete: { type: Number, min: 0, max: 100 },
    // Could use a generic progressNotes as well
    progressNotes: { type: String },

    coverImageUrl: {
      // URL to the cover art/poster
      type: String,
      trim: true,
      default: "",
    },
    genre: [{ type: String, trim: true }],
    releaseYear: { type: Number },
    startedDate: { type: Date },
    completedDate: { type: Date },
  },
  { timestamps: true }
);

// When status changes to 'completed' or 'watched', set completedDate
MediaItemSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    (this.status === "completed" || this.status === "watched") &&
    !this.completedDate
  ) {
    this.completedDate = Date.now();
  } else if (
    this.isModified("status") &&
    this.status !== "completed" &&
    this.status !== "watched"
  ) {
    this.completedDate = null;
  }
  next();
});

module.exports = mongoose.model("MediaItem", MediaItemSchema);

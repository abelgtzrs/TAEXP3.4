// server/models/userSpecific/Note.js
const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: "Untitled Note",
    },
    content: {
      type: String,
      required: [true, "Note content cannot be empty"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    // For Time Capsule feature (Post-MVP)
    // openDate: { type: Date },
    // isSealed: { type: Boolean, default: false },
    // color: { type: String } // Optional for categorizing/styling notes
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);

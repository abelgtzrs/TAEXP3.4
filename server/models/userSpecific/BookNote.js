// server/models/userSpecific/BookNote.js
const mongoose = require("mongoose");

const BookNoteSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ["note", "quote"],
      default: "note",
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },
    pageStart: {
      type: Number,
      min: 0,
    },
    pageEnd: {
      type: Number,
      min: 0,
    },
    chapter: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Note content is required"],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  { timestamps: true }
);

// Simple validation: if both pageStart and pageEnd provided, ensure order.
BookNoteSchema.pre("save", function (next) {
  if (this.pageStart != null && this.pageEnd != null && this.pageStart > this.pageEnd) {
    const tmp = this.pageStart;
    this.pageStart = this.pageEnd;
    this.pageEnd = tmp;
  }
  next();
});

module.exports = mongoose.model("BookNote", BookNoteSchema);

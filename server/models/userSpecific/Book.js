// server/models/userSpecific/Book.js
const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Please provide the book title"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Please provide the book author(s)"],
      trim: true,
    },
    year: {
      // Publication year
      type: Number,
    },
    totalPages: {
      type: Number,
      required: [true, "Please provide the total number of pages"],
    },
    pagesRead: {
      type: Number,
      default: 0,
      validate: [
        function (value) {
          // Custom validator
          // 'this' refers to the document being validated
          return value <= this.totalPages;
        },
        "Pages read cannot exceed total pages.",
      ],
    },
    isFinished: {
      type: Boolean,
      default: false,
    },
    isOwned: {
      // Physical copy, ebook, audiobook?
      type: Boolean,
      default: true, // Default to owned, can be changed by user
    },
    coverImageUrl: {
      // URL to the book cover
      type: String,
      trim: true,
      default: "",
    },
    synopsis: {
      type: String,
      trim: true,
      default: "",
    },
    userRating: {
      // User's rating after finishing, e.g., 1-5 or 1-10
      type: Number,
      min: 1,
      max: 10, // Or 5, depending on your preferred scale
    },
    notes: {
      // Personal thoughts or notes on the book
      type: String,
      trim: true,
      default: "",
    },
    startedDate: {
      type: Date,
    },
    finishedDate: {
      type: Date,
    },
    // genre: [String] // Optional
    // series: { name: String, numberInSeries: Number } // Optional
  },
  { timestamps: true }
);

// Middleware to automatically set isFinished and finishedDate if pagesRead >= totalPages
BookSchema.pre("save", function (next) {
  if (this.isModified("pagesRead") || this.isNew) {
    if (this.pagesRead >= this.totalPages && this.totalPages > 0) {
      // Ensure totalPages is not 0
      if (!this.isFinished) {
        // Only update if not already marked finished
        this.isFinished = true;
        this.finishedDate = Date.now();
        // The EXP/Token reward logic will be in the API controller when isFinished is set to true
      }
    } else {
      // If pagesRead is reduced below totalPages, unfinish it (optional behavior)
      // this.isFinished = false;
      // this.finishedDate = null;
    }
  }
  next();
});

module.exports = mongoose.model("Book", BookSchema);

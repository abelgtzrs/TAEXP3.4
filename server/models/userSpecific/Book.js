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
    pdfUrl: {
      // Path to uploaded PDF for immersive reading workspace
      type: String,
      trim: true,
      default: "",
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

// --- Mongoose Middleware ---

// This 'pre-save' hook runs before a Book document is saved.
// It automatically handles setting the 'isFinished' and 'finishedDate' fields
// based on the user's reading progress.
BookSchema.pre("save", function (next) {
  // Check if the 'pagesRead' field was changed or if this is a new book.
  if (this.isModified("pagesRead") || this.isNew) {
    // If pagesRead equals or exceeds totalPages, the book is considered finished.
    if (this.pagesRead >= this.totalPages && this.totalPages > 0) {
      // Only update the finishedDate if it's not already set.
      if (!this.isFinished) {
        this.isFinished = true;
        this.finishedDate = Date.now();
        // NOTE: The reward logic (awarding XP/Hearts) is handled in the controller,
        // not here. The controller is a better place for business logic that
        // affects other models (like the User model).
      }
    }
  }
  // Continue to the next step in the save process.
  next();
});

module.exports = mongoose.model("Book", BookSchema);

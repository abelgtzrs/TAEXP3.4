// server/controllers/bookController.js

const Book = require("../models/userSpecific/Book"); // Import the Book model.
const User = require("../models/User"); // Import User model for rewards.

// @desc    Create a new book entry for the logged-in user
// @route   POST /api/books
exports.createBook = async (req, res) => {
  try {
    // Add the user's ID to the request body data.
    req.body.user = req.user.id;

    // Create the book in the database.
    const book = await Book.create(req.body);

    // Send a success response.
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    console.error("Create Book Error:", error);
    res.status(400).json({
      success: false,
      message: "Error creating book entry",
      error: error.message,
    });
  }
};

// @desc    Get all books for the logged-in user
// @route   GET /api/books
exports.getUserBooks = async (req, res) => {
  try {
    // Find all books belonging to the logged-in user.
    const books = await Book.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    // Send the list of books as a response.
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    console.error("Get User Books Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update an existing book entry
// @route   PUT /api/books/:bookId
exports.updateBook = async (req, res) => {
  try {
    // --- Step 1: Find the full document first ---
    // This brings the entire book document into our code, including 'totalPages'.
    const book = await Book.findById(req.params.bookId);

    // --- Step 2: Perform Checks ---
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book entry not found with that ID" });
    }

    // Security check: Ensure the logged-in user owns this book entry.
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this entry",
      });
    }

    // --- Step 3: Check for Reward Trigger ---
    // Capture the 'isFinished' state *before* any changes are made.
    const wasFinishedBefore = book.isFinished;

    // --- Step 4: Apply Updates and Save ---
    // This is the key change. We modify the document we found...
    Object.assign(book, req.body);

    // ...and then we call .save(). This method triggers all document middleware,
    // including our custom validator, which will now work correctly.
    const updatedBook = await book.save();

    // --- Step 5: Handle Reward Logic After Successful Save ---
    if (updatedBook.isFinished && !wasFinishedBefore) {
      const user = await User.findById(req.user.id);

      if (typeof user.xpToNextLevel !== "number" || isNaN(user.xpToNextLevel)) {
        user.xpToNextLevel = 100;
      }

      const BOOK_FINISH_XP = 150;
      const WENDY_HEARTS_AWARD = 25;

      user.wendyHearts = (user.wendyHearts || 0) + WENDY_HEARTS_AWARD;
      user.experience = (user.experience || 0) + BOOK_FINISH_XP;

      // Check for user level up
      if (user.experience >= user.xpToNextLevel) {
        user.level += 1;
        user.experience -= user.xpToNextLevel;
        user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.25);
      }

      await user.save();

      // Return a special success response
      return res.status(200).json({
        success: true,
        message: `Book finished! +${BOOK_FINISH_XP} XP, +${WENDY_HEARTS_AWARD} Wendy Hearts!`,
        data: updatedBook,
      });
    }

    // If the book wasn't just finished, send a standard success response.
    res.status(200).json({ success: true, data: updatedBook });
  } catch (error) {
    // Now, if a validation error occurs, it will be caught here correctly.
    console.error("Update Book Error:", error);

    // Send back a more specific validation error message if that's what it is.
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }

    // Otherwise, send a generic server error.
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a book entry
// @route   DELETE /api/books/:bookId
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book entry not found" });
    }

    // Security check: Ensure user owns this entry.
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this entry",
      });
    }

    // Remove the book from the database.
    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: "Book entry deleted successfully",
      data: {},
    });
  } catch (error) {
    console.error("Delete Book Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

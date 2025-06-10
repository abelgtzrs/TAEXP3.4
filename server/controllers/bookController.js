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
    res
      .status(400)
      .json({
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
    // Find the book by its ID from the URL parameter.
    let book = await Book.findById(req.params.bookId);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book entry not found" });
    }

    // Security check: Ensure the user owns this book entry.
    if (book.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Not authorized to update this entry",
        });
    }

    // --- Reward Logic ---
    // We need to check the book's 'isFinished' status *before* we update it.
    const wasFinishedBefore = book.isFinished;

    // Update the book document with the data from the request body.
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.bookId,
      req.body,
      {
        new: true, // Return the updated document.
        runValidators: true, // Ensure updates follow schema rules.
      }
    );

    // Check if the book's status has just changed from not finished to finished.
    if (updatedBook.isFinished && !wasFinishedBefore) {
      // Find the user to give them their reward.
      const user = await User.findById(req.user.id);

      // Define the rewards. These can be moved to a config file later.
      const BOOK_FINISH_XP = 150; // More XP for finishing a book!
      const WENDY_HEARTS_AWARD = 25;

      // Add the rewards to the user's stats.
      user.wendyHearts += WENDY_HEARTS_AWARD;
      user.experience += BOOK_FINISH_XP;

      // Check for user level up.
      if (user.experience >= user.xpToNextLevel) {
        user.level += 1;
        user.experience -= user.xpToNextLevel;
        user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.25);
      }

      // Save the updated user document.
      await user.save();

      // Send a special success response indicating a reward was given.
      return res.status(200).json({
        success: true,
        message: `Book finished! +${BOOK_FINISH_XP} XP, +${WENDY_HEARTS_AWARD} Wendy Hearts!`,
        data: updatedBook,
      });
    }

    // If the book wasn't just finished, send a standard success response.
    res.status(200).json({ success: true, data: updatedBook });
  } catch (error) {
    console.error("Update Book Error:", error);
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
      return res
        .status(401)
        .json({
          success: false,
          message: "Not authorized to delete this entry",
        });
    }

    // Remove the book from the database.
    await book.remove();

    res
      .status(200)
      .json({
        success: true,
        message: "Book entry deleted successfully",
        data: {},
      });
  } catch (error) {
    console.error("Delete Book Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

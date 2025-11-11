const express = require("express");
const router = express.Router();
// Controller functions for book management
const {
  createBook,
  getUserBooks,
  updateBook,
  deleteBook,
  markBookAsFinished,
} = require("../controllers/bookController");
const bookNoteRoutes = require("./bookNoteRoutes");
const multer = require("multer");
const path = require("path");

// Multer storage for PDF uploads
const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/books"));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const pdfUpload = multer({
  storage: pdfStorage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
});

const Book = require("../models/userSpecific/Book");

// Upload & attach PDF to book
async function attachPdf(req, res) {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    if (book.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: "Not authorized" });
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    // Normalize path for client access
    book.pdfUrl = `/uploads/books/${req.file.filename}`;
    await book.save();
    res.status(200).json({ success: true, message: "PDF attached", data: book });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
}
// Protection middleware to ensure user is authenticated
const { protect } = require("../middleware/authMiddleware");

// Apply the protect middleware to all routes in this router
router.use(protect);

router.route("/").get(getUserBooks).post(createBook);

router
  .route("/:bookId") // This defines a URL parameter named 'bookId'
  .put(protect, updateBook)
  .delete(protect, deleteBook);

// PDF upload endpoint
router.post("/:bookId/pdf", protect, pdfUpload.single("pdf"), attachPdf);

// Nested notes routes for a specific book
router.use("/:bookId/notes", bookNoteRoutes);

module.exports = router;

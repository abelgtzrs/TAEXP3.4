// server/controllers/bookNoteController.js
const BookNote = require("../models/userSpecific/BookNote");
const Book = require("../models/userSpecific/Book");

// Ensure the book belongs to current user
async function assertBookOwnership(bookId, userId) {
  const book = await Book.findById(bookId).select("user");
  if (!book) throw new Error("Book not found");
  if (book.user.toString() !== userId) throw new Error("Not authorized for this book");
  return book;
}

// GET /api/books/:bookId/notes
exports.listNotes = async (req, res) => {
  try {
    await assertBookOwnership(req.params.bookId, req.user.id);
    const notes = await BookNote.find({ book: req.params.bookId, user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// POST /api/books/:bookId/notes
exports.createNote = async (req, res) => {
  try {
    await assertBookOwnership(req.params.bookId, req.user.id);
    const note = await BookNote.create({ ...req.body, book: req.params.bookId, user: req.user.id });
    res.status(201).json({ success: true, data: note });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// PUT /api/books/:bookId/notes/:noteId
exports.updateNote = async (req, res) => {
  try {
    await assertBookOwnership(req.params.bookId, req.user.id);
    const note = await BookNote.findOne({ _id: req.params.noteId, book: req.params.bookId, user: req.user.id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    Object.assign(note, req.body);
    const updated = await note.save();
    res.status(200).json({ success: true, data: updated });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// DELETE /api/books/:bookId/notes/:noteId
exports.deleteNote = async (req, res) => {
  try {
    await assertBookOwnership(req.params.bookId, req.user.id);
    const note = await BookNote.findOne({ _id: req.params.noteId, book: req.params.bookId, user: req.user.id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    await note.deleteOne();
    res.status(200).json({ success: true, message: "Deleted", data: {} });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

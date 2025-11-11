const express = require("express");
const router = express.Router({ mergeParams: true });
const { listNotes, createNote, updateNote, deleteNote } = require("../controllers/bookNoteController");

// Parent router (bookRoutes) already applies protect middleware.

router.route("/").get(listNotes).post(createNote);

router.route("/:noteId").put(updateNote).delete(deleteNote);

module.exports = router;

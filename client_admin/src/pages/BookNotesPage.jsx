// src/pages/BookNotesPage.jsx
// A focused workspace for deep book interaction: page/chapter notes & metadata review.
// Assumptions: There is no single GET /books/:id endpoint yet, so we fetch all and filter.
// Future: Replace with dedicated endpoint; add per-chapter note model.

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { listBookNotes, createBookNote, deleteBookNote, uploadBookPdf } from "../services/bookNotes";
import BookNoteForm from "../components/books/BookNoteForm";
import BookNoteList from "../components/books/BookNoteList";
import Widget from "../components/ui/Widget";
import StyledButton from "../components/ui/StyledButton";
import StyledInput from "../components/ui/StyledInput";
import PageHeader from "../components/ui/PageHeader";

const BookNotesPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [pagesReadDraft, setPagesReadDraft] = useState(0);
  const [saving, setSaving] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteListLoading, setNoteListLoading] = useState(false);
  const [bookNotes, setBookNotes] = useState([]);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books");
        const found = response.data.data.find((b) => b._id === bookId);
        if (!found) {
          setError("Book not found in your library.");
        } else {
          setBook(found);
          setNotes(found.notes || "");
          setPagesReadDraft(found.pagesRead || 0);
        }
      } catch (e) {
        setError("Failed to load books.");
      } finally {
        setLoading(false);
      }
    };
    const fetchNotes = async () => {
      setNoteListLoading(true);
      try {
        const res = await listBookNotes(bookId);
        setBookNotes(res.data.data || []);
      } catch (e) {
        // Non-fatal
      } finally {
        setNoteListLoading(false);
      }
    };
    fetchBooks();
    fetchNotes();
  }, [bookId]);

  const handleSave = async () => {
    if (!book) return;
    setSaving(true);
    try {
      const payload = { notes, pagesRead: Number(pagesReadDraft) };
      const response = await api.put(`/books/${book._id}`, payload);
      setBook(response.data.data);
    } catch (e) {
      setError(e.response?.data?.message || "Could not save notes.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateStructuredNote = async (payload, resetCallback) => {
    setNoteSaving(true);
    try {
      const res = await createBookNote(bookId, payload);
      setBookNotes((prev) => [res.data.data, ...prev]);
      if (resetCallback) resetCallback();
    } catch (e) {
      setError(e.response?.data?.message || "Could not create structured note.");
    } finally {
      setNoteSaving(false);
    }
  };

  const handleDeleteStructuredNote = async (noteId) => {
    try {
      await deleteBookNote(bookId, noteId);
      setBookNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (e) {
      setError(e.response?.data?.message || "Could not delete note.");
    }
  };

  const progressPercent = book && book.totalPages > 0 ? (book.pagesRead / book.totalPages) * 100 : 0;
  const apiBase = api.defaults.baseURL || "";
  const publicBase = apiBase.replace(/\/?api\/?$/, "");
  const pdfSrc = book?.pdfUrl ? `${publicBase}${book.pdfUrl}` : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      <PageHeader
        title="Book Notes Workspace"
        subtitle="Capture detailed thoughts, page markers, and meta insights while reading."
      />
      <div className="mt-2 mb-6 text-xs text-text-tertiary">
        <button onClick={() => navigate(-1)} className="underline hover:text-white">
          ← Back
        </button>
      </div>
      {loading && <p className="text-text-secondary">Loading book data...</p>}
      {error && !loading && <p className="text-status-danger">{error}</p>}
      {!loading && !error && book && (
        <div className="space-y-6">
          <Widget title={book.title} className="relative">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full sm:w-56 lg:w-64 flex-shrink-0">
                {book.coverImageUrl ? (
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-full h-auto rounded-xl ring-2 ring-primary/40"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] rounded-xl bg-background flex items-center justify-center text-text-tertiary text-xs">
                    No Cover
                  </div>
                )}
                <div className="mt-4 space-y-1 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Author</span>
                    <span>{book.author}</span>
                  </div>
                  {book.year && (
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Year</span>
                      <span>{book.year}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Pages</span>
                    <span>
                      {book.pagesRead}/{book.totalPages}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Finished</span>
                    <span>{book.isFinished ? "Yes" : "No"}</span>
                  </div>
                  {book.userRating && (
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Rating</span>
                      <span>{book.userRating}/10</span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <div className="w-full bg-background rounded-full h-2.5 mb-1">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <p className="text-[11px] text-text-tertiary">Progress {Math.round(progressPercent)}%</p>
                </div>
              </div>
              <div className="flex-grow space-y-6">
                {book.synopsis && (
                  <Widget title="Synopsis" className="bg-gray-800/60">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-text-secondary">{book.synopsis}</p>
                  </Widget>
                )}
                <Widget title="General Reading Notes" className="bg-gray-800/60">
                  <div className="space-y-3">
                    <label className="block text-xs text-text-tertiary">Pages Read</label>
                    <StyledInput
                      type="number"
                      min={0}
                      max={book.totalPages}
                      value={pagesReadDraft}
                      onChange={(e) => setPagesReadDraft(e.target.value)}
                      className="w-32"
                    />
                    <label className="block text-xs text-text-tertiary mt-4">Your Notes / Thoughts</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={10}
                      placeholder="Reflections, memorable quotes, chapter summaries..."
                      className="w-full rounded-md bg-gray-900/70 border border-gray-700 p-3 text-sm resize-vertical focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <div className="flex gap-2 flex-wrap">
                      <StyledButton
                        onClick={handleSave}
                        disabled={saving}
                        className="py-2 px-4 text-sm bg-status-info disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save Notes"}
                      </StyledButton>
                      <StyledButton
                        onClick={() => navigate(-1)}
                        className="py-2 px-4 text-sm bg-gray-700 hover:bg-gray-600"
                      >
                        Cancel
                      </StyledButton>
                    </div>
                  </div>
                </Widget>
                <Widget title="Structured Notes" className="bg-gray-800/60">
                  <div className="space-y-6">
                    <BookNoteForm onSave={handleCreateStructuredNote} loading={noteSaving} />
                    <div className="pt-2 border-t border-gray-700/40">
                      {noteListLoading ? (
                        <p className="text-text-tertiary text-sm">Loading structured notes...</p>
                      ) : (
                        <BookNoteList notes={bookNotes} onDelete={handleDeleteStructuredNote} onUpdate={() => {}} />
                      )}
                    </div>
                  </div>
                </Widget>
                <Widget title="Reader" className="bg-gray-800/60">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-text-tertiary">Attach PDF (up to 25MB)</label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file || !book) return;
                          setUploadingPdf(true);
                          try {
                            const res = await uploadBookPdf(book._id, file);
                            setBook(res.data.data);
                          } catch (err) {
                            setError(err.response?.data?.message || "Failed to upload PDF");
                          } finally {
                            setUploadingPdf(false);
                          }
                        }}
                        className="block text-sm"
                      />
                      {uploadingPdf && <span className="text-xs text-text-tertiary">Uploading…</span>}
                    </div>
                    {pdfSrc ? (
                      <div className="w-full h-[calc(100vh-220px)] rounded-md overflow-hidden border border-gray-700/60">
                        <iframe src={pdfSrc} className="w-full h-full bg-black" title="Book PDF" />
                      </div>
                    ) : (
                      <p className="text-text-tertiary text-sm">No PDF attached yet.</p>
                    )}
                  </div>
                </Widget>
                <Widget title="Future Interactions" className="bg-gray-800/60">
                  <p className="text-xs text-text-secondary mb-2">Coming soon:</p>
                  <ul className="text-[12px] list-disc pl-5 space-y-1 text-text-tertiary">
                    <li>Per-chapter note segmentation.</li>
                    <li>Quote extraction & highlight tracking.</li>
                    <li>Tagging themes, characters, motifs.</li>
                    <li>AI summary & sentiment analysis.</li>
                  </ul>
                </Widget>
              </div>
            </div>
          </Widget>
        </div>
      )}
    </motion.div>
  );
};

export default BookNotesPage;

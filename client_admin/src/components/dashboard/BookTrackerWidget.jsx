import { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import Widget from "../ui/Widget";

const BookTrackerWidget = () => {
  const [recentBooks, setRecentBooks] = useState([]);
  const [pageUpdates, setPageUpdates] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(0);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      const books = response.data.data || [];

      // Keep all in state; we will filter/paginate in render
      setRecentBooks(books.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)));

      // Initialize page updates to current pages
      const initialPages = {};
      books.forEach((book) => {
        initialPages[book._id] = book.pagesRead || 0;
      });
      setPageUpdates(initialPages);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleUpdateProgress = async (bookId) => {
    const book = recentBooks.find((b) => b._id === bookId);
    const newPages = pageUpdates[bookId];

    if (Number(newPages) !== book.pagesRead) {
      try {
        await api.put(`/books/${bookId}`, { pagesRead: Number(newPages) });
        fetchBooks(); // Refresh data after update
      } catch (error) {
        alert("Failed to update progress.");
      }
    }
  };

  const handlePageChange = (bookId, value) => {
    setPageUpdates((prev) => ({
      ...prev,
      [bookId]: value,
    }));
  };

  // Derived collections and pagination
  const filtered = useMemo(() => {
    const list = showAll ? recentBooks : recentBooks.filter((b) => !b.isFinished);
    return list;
  }, [recentBooks, showAll]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const start = currentPage * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  useEffect(() => {
    // Reset to first page whenever filter changes
    setPage(0);
  }, [showAll]);

  if (recentBooks.length === 0) {
    return (
      <Widget title="Book Tracker">
        <p className="text-sm text-text-tertiary">No active books. Go to the Book Tracker to start one!</p>
      </Widget>
    );
  }

  return (
    <Widget title="Book Tracker">
      {/* Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-text-secondary">
          {filtered.length} book{filtered.length !== 1 ? "s" : ""}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAll((s) => !s)}
            className={`px-2 py-1 rounded text-xs border ${
              showAll ? "bg-primary text-white border-transparent" : "bg-background border-white/20 hover:bg-white/10"
            }`}
          >
            {showAll ? "Showing All" : "Active Only"}
          </button>
          <div className="inline-flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-2 py-1 rounded text-xs bg-background border border-white/20 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-xs text-text-secondary">
              Page {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-2 py-1 rounded text-xs bg-background border border-white/20 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {pageItems.map((book, index) => {
          const total = Number(book.totalPages) || 0;
          const read = Number(book.pagesRead) || 0;
          const progressPercent = total > 0 ? (read / total) * 100 : 0;
          const currentPages = pageUpdates[book._id] ?? read;

          return (
            <div key={book._id} className={`${index < pageItems.length - 1 ? "border-b border-gray-700/30 pb-3" : ""}`}>
              <div className="flex gap-3">
                {/* Cover Image */}
                {book.coverImageUrl && (
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded shadow-md flex-shrink-0"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}

                {/* Book Details */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2">
                    <p className="text-xs font-bold text-white truncate">
                      {book.title} {book.year && `(${book.year})`}
                    </p>
                    <p className="text-xs text-text-secondary truncate">{book.author}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-background rounded-full h-1.5 mb-2">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                  </div>

                  {/* Progress Text and Update Controls */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-text-tertiary">
                      {book.pagesRead} / {book.totalPages} pages ({Math.round(progressPercent)}%)
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={currentPages}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const clamped = Math.max(0, Math.min(total, Number.isFinite(val) ? val : 0));
                          handlePageChange(book._id, clamped);
                        }}
                        className="w-16 p-1 bg-background rounded border border-gray-700/50 text-white text-xs"
                        min="0"
                        max={book.totalPages}
                      />
                      <button
                        onClick={() => handleUpdateProgress(book._id)}
                        disabled={Number(currentPages) === read}
                        className="bg-status-info hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-1 px-2 rounded text-xs"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Widget>
  );
};

export default BookTrackerWidget;

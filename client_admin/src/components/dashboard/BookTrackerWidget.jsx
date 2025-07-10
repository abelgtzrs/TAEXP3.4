import { useState, useEffect } from "react";
import api from "../../services/api";
import Widget from "./Widget";

const BookTrackerWidget = () => {
  const [recentBooks, setRecentBooks] = useState([]);
  const [pageUpdates, setPageUpdates] = useState({});

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      const books = response.data.data;

      // Get last 4 modified active books (unfinished books sorted by updatedAt)
      const activeBooks = books
        .filter((b) => !b.isFinished)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 4);
      setRecentBooks(activeBooks);

      // Initialize page updates state with current pages
      const initialPages = {};
      activeBooks.forEach((book) => {
        initialPages[book._id] = book.pagesRead;
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

  if (recentBooks.length === 0) {
    return (
      <Widget title="Book Tracker">
        <p className="text-sm text-text-tertiary">No active books. Go to the Book Tracker to start one!</p>
      </Widget>
    );
  }

  return (
    <Widget title="Book Tracker">
      <div className="space-y-3">
        {recentBooks.map((book, index) => {
          const progressPercent = (book.pagesRead / book.totalPages) * 100;
          const currentPages = pageUpdates[book._id] || book.pagesRead;

          return (
            <div
              key={book._id}
              className={`${index < recentBooks.length - 1 ? "border-b border-gray-700/30 pb-3" : ""}`}
            >
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
                        onChange={(e) => handlePageChange(book._id, e.target.value)}
                        className="w-16 p-1 bg-background rounded border border-gray-700/50 text-white text-xs"
                        min="0"
                        max={book.totalPages}
                      />
                      <button
                        onClick={() => handleUpdateProgress(book._id)}
                        disabled={Number(currentPages) === book.pagesRead}
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

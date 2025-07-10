import { useState, useEffect } from "react";
import api from "../../services/api";
import Widget from "./Widget";

const BookTrackerWidget = () => {
  const [currentBook, setCurrentBook] = useState(null);
  const [pages, setPages] = useState(0);

  const fetchCurrentBook = async () => {
    try {
      const response = await api.get("/books");
      const bookInProgress = response.data.data.find((b) => !b.isFinished);
      setCurrentBook(bookInProgress);
      if (bookInProgress) {
        setPages(bookInProgress.pagesRead);
      }
    } catch (error) {
      console.error("Failed to fetch current book:", error);
    }
  };

  useEffect(() => {
    fetchCurrentBook();
  }, []);

  const handleUpdateProgress = async () => {
    if (Number(pages) !== currentBook.pagesRead) {
      try {
        await api.put(`/books/${currentBook._id}`, { pagesRead: Number(pages) });
        fetchCurrentBook(); // Refresh data after update
      } catch (error) {
        alert("Failed to update progress.");
      }
    }
  };

  if (!currentBook) {
    return (
      <Widget title="Currently Reading">
        <p className="text-sm text-text-tertiary">No active book. Go to the Book Tracker to start one!</p>
      </Widget>
    );
  }

  const progressPercent = (currentBook.pagesRead / currentBook.totalPages) * 100;

  return (
    <Widget title="Currently Reading">
      <p className="text-lg font-bold text-white truncate">{currentBook.title}</p>
      <p className="text-sm text-text-secondary mb-3">{currentBook.author}</p>
      <div className="w-full bg-background rounded-full h-2">
        <div className="bg-primary h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
      </div>
      <p className="text-xs text-text-tertiary mt-1 text-right">
        {currentBook.pagesRead} / {currentBook.totalPages} pages
      </p>
      <div className="flex items-center gap-2 mt-4">
        <input
          type="number"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          className="w-24 p-2 bg-background rounded border border-gray-700/50 text-white"
        />
        <button
          onClick={handleUpdateProgress}
          className="bg-status-info hover:opacity-80 text-white font-semibold py-2 px-4 rounded-md text-sm"
        >
          Update
        </button>
      </div>
    </Widget>
  );
};

export default BookTrackerWidget;

// src/components/books/BookItem.jsx
import { useState } from "react";

const BookItem = ({ book, onUpdate, onDelete, onFinish }) => {
  const [pages, setPages] = useState(book.pagesRead);
  const progressPercent =
    book.totalPages > 0 ? (book.pagesRead / book.totalPages) * 100 : 0;

  const handleProgressUpdate = () => {
    // Only update if the page number has actually changed.
    if (Number(pages) !== book.pagesRead) {
      onUpdate(book._id, { pagesRead: Number(pages) });
    }
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-lg border transition-all duration-300 ${
        book.isFinished
          ? "bg-green-900/40 border-green-500/30"
          : "bg-gray-800/70 border-gray-700/50"
      }`}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Cover Image Placeholder */}
        <div className="w-full md:w-24 h-36 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center text-gray-500 text-xs">
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            "No Cover"
          )}
        </div>

        {/* Book Info and Progress */}
        <div className="flex-grow">
          <h3
            className={`text-xl font-bold ${
              book.isFinished ? "text-green-300 line-through" : "text-white"
            }`}
          >
            {book.title}
          </h3>
          <p className="text-md text-gray-400 mb-2">{book.author}</p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
            <div
              className="bg-teal-500 h-2.5 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            {book.pagesRead} / {book.totalPages} pages read (
            {Math.round(progressPercent)}%)
          </p>

          {/* Progress Update Form */}
          {!book.isFinished && (
            <div className="flex items-center gap-2 mt-4">
              <input
                type="number"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                onBlur={handleProgressUpdate} // Update when user clicks away
                className="w-24 p-2 bg-gray-900 rounded border border-gray-600 text-white focus:outline-none focus:border-teal-500"
                min="0"
                max={book.totalPages}
              />
              <button
                onClick={() => onFinish(book._id)}
                className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-md text-sm"
              >
                Mark as Finished
              </button>
            </div>
          )}
        </div>

        {/* Delete Button */}
        <div className="flex-shrink-0">
          <button
            onClick={() => onDelete(book._id)}
            className="bg-red-800 hover:bg-red-700 text-white font-bold p-2 rounded-full text-xs"
            title="Delete Book"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookItem;

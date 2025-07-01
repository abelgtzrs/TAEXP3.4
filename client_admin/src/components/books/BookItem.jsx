// src/components/books/BookItem.jsx
import { useState } from "react";
import Widget from "../ui/Widget"; // Import Widget
import StyledButton from "../ui/StyledButton";
import StyledInput from "../ui/StyledInput";

const BookItem = ({ book, onUpdate, onDelete, onFinish }) => {
  const [currentPage, setCurrentPage] = useState(book.pagesRead);
  const progressPercent = book.totalPages > 0 ? (book.pagesRead / book.totalPages) * 100 : 0;

  const handleProgressUpdate = () => {
    if (Number(currentPage) !== book.pagesRead) {
      onUpdate(book._id, { pagesRead: Number(currentPage) });
    }
  };

  return (
    <Widget
      className={`transition-all duration-300 ${book.isFinished ? "border-status-success/30" : "border-gray-700/50"}`}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-24 h-36 bg-background rounded flex-shrink-0">
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover rounded" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-text-tertiary">No Cover</div>
          )}
        </div>
        <div className="flex-grow">
          <h3
            className={`text-xl font-bold ${
              book.isFinished ? "text-status-success/80 line-through" : "text-text-main"
            }`}
          >
            {book.title}
          </h3>
          <p className="text-md text-text-secondary mb-2">
            {book.author} {book.year ? `(${book.year})` : ""}
          </p>
          <div className="w-full bg-background rounded-full h-2.5 mb-1">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-xs text-text-tertiary">
            {book.pagesRead} / {book.totalPages} pages ({Math.round(progressPercent)}%)
          </p>
          {!book.isFinished && (
            <div className="flex items-center gap-2 mt-4">
              <StyledInput
                type="number"
                value={currentPage}
                onChange={(e) => setCurrentPage(e.target.value)}
                className="w-24 p-2"
                min="0"
                max={book.totalPages}
              />
              <StyledButton onClick={handleProgressUpdate} className="py-2 px-4 text-sm bg-status-info">
                Update
              </StyledButton>
              <StyledButton onClick={() => onFinish(book._id)} className="py-2 px-4 text-sm bg-status-success">
                Finish
              </StyledButton>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={() => onDelete(book._id)}
            className="text-status-danger/70 hover:text-status-danger"
            title="Delete Book"
          >
            🗑️
          </button>
        </div>
      </div>
    </Widget>
  );
};

export default BookItem;

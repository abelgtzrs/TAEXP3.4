// src/components/books/BookItem.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Widget from "../ui/Widget"; // Import Widget
import StyledButton from "../ui/StyledButton";
import StyledInput from "../ui/StyledInput";

const BookItem = ({ book, onUpdate, onDelete, onFinish }) => {
  const [currentPage, setCurrentPage] = useState(book.pagesRead);
  const [showTooltip, setShowTooltip] = useState(false);
  const progressPercent = book.totalPages > 0 ? (book.pagesRead / book.totalPages) * 100 : 0;

  const handleProgressUpdate = () => {
    if (Number(currentPage) !== book.pagesRead) {
      onUpdate(book._id, { pagesRead: Number(currentPage) });
    }
  };

  const tooltipFields = [
    { label: "Author", value: book.author },
    { label: "Year", value: book.year },
    { label: "Pages", value: `${book.pagesRead}/${book.totalPages}` },
    { label: "Finished", value: book.isFinished ? "Yes" : "No" },
    { label: "Owned", value: book.isOwned ? "Yes" : "No" },
    { label: "Rating", value: book.userRating ? `${book.userRating}/10` : "—" },
  ];

  return (
    <Widget
      className={`transition-all duration-300 relative overflow-visible ${
        book.isFinished ? "border-status-success/30" : "border-gray-700/50"
      }`}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Cover Section */}
        <div
          className="group relative w-full md:w-40 lg:w-48 h-56 lg:h-64 bg-background rounded-xl flex-shrink-0 shadow-lg shadow-black/30 cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          tabIndex={0}
          aria-label={`Cover image for ${book.title}`}
        >
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-full h-full object-cover rounded-xl ring-2 ring-primary/40 group-hover:ring-primary/80 transition-all"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-text-tertiary">No Cover</div>
          )}
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="absolute z-30 left-full top-0 ml-3 w-80 max-h-[26rem] overflow-y-auto rounded-xl bg-gray-900/95 backdrop-blur border border-gray-700 shadow-xl p-4 text-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-24 rounded bg-background overflow-hidden flex-shrink-0">
                    {book.coverImageUrl ? (
                      <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-[10px] text-text-tertiary">
                        No Cover
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-white leading-tight mb-1">{book.title}</h4>
                    <p className="text-[11px] text-text-tertiary">ID: {book._id}</p>
                  </div>
                  <Link
                    to={`/books/${book._id}/notes`}
                    className="text-text-tertiary hover:text-white p-1 rounded-md hover:bg-gray-700"
                    title="Open notes & interactions"
                  >
                    ⚙️
                  </Link>
                </div>
                <div className="mt-3 space-y-1">
                  {tooltipFields.map((f) => (
                    <div key={f.label} className="flex justify-between text-[12px]">
                      <span className="text-text-tertiary uppercase tracking-wide">{f.label}</span>
                      <span className="text-text-main font-medium">{f.value || "—"}</span>
                    </div>
                  ))}
                </div>
                {book.synopsis && (
                  <div className="mt-3">
                    <p className="text-[11px] text-text-tertiary mb-1 uppercase tracking-wide">Synopsis</p>
                    <p className="text-[12px] leading-relaxed text-text-secondary whitespace-pre-wrap">
                      {book.synopsis.length > 450 ? book.synopsis.slice(0, 450) + "…" : book.synopsis}
                    </p>
                  </div>
                )}
                {book.notes && (
                  <div className="mt-3">
                    <p className="text-[11px] text-text-tertiary mb-1 uppercase tracking-wide">Personal Notes</p>
                    <p className="text-[12px] leading-relaxed text-text-secondary whitespace-pre-wrap">
                      {book.notes.length > 450 ? book.notes.slice(0, 450) + "…" : book.notes}
                    </p>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <div className="w-full bg-background/60 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                      aria-label={`Progress ${Math.round(progressPercent)}%`}
                    ></div>
                  </div>
                  <span className="ml-3 text-[11px] text-text-secondary font-medium">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Main Info / Controls */}
        <div className="flex-grow">
          <h3
            className={`text-2xl font-bold mb-1 ${
              book.isFinished ? "text-status-success/80 line-through" : "text-text-main"
            }`}
          >
            {book.title}
          </h3>
          <p className="text-sm text-text-secondary mb-3">
            {book.author} {book.year ? `(${book.year})` : ""}
          </p>
          <div className="w-full bg-background rounded-full h-3 mb-1">
            <div
              className="bg-gradient-to-r from-primary to-pink-500 h-3 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-text-tertiary">
            {book.pagesRead} / {book.totalPages} pages ({Math.round(progressPercent)}%)
          </p>
          {!book.isFinished && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <StyledInput
                type="number"
                value={currentPage}
                onChange={(e) => setCurrentPage(e.target.value)}
                className="w-24 p-2"
                min="0"
                max={book.totalPages}
                aria-label="Pages read input"
              />
              <StyledButton onClick={handleProgressUpdate} className="py-2 px-4 text-sm bg-status-info">
                Update
              </StyledButton>
              <StyledButton onClick={() => onFinish(book._id)} className="py-2 px-4 text-sm bg-status-success">
                Finish
              </StyledButton>
              <Link
                to={`/books/${book._id}/notes`}
                className="py-2 px-3 text-sm rounded bg-gray-700/70 hover:bg-gray-600 text-text-secondary hover:text-white transition-colors"
              >
                Notes / ⚙️
              </Link>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <button
            onClick={() => onDelete(book._id)}
            className="text-status-danger/70 hover:text-status-danger"
            title="Delete Book"
            aria-label="Delete book"
          >
            🗑️
          </button>
        </div>
      </div>
    </Widget>
  );
};

export default BookItem;

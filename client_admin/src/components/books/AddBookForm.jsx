// src/components/books/AddBookForm.jsx
import { useState } from "react";

const AddBookForm = ({ onAddBook }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(""); // New state
  const [year, setYear] = useState(""); // New state

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || !totalPages) return;
    // Pass all the new data up to the parent component
    onAddBook({
      title,
      author,
      totalPages: Number(totalPages),
      coverImageUrl,
      year: year ? Number(year) : undefined, // Send year only if it exists
    });
    // Reset all fields
    setTitle("");
    setAuthor("");
    setTotalPages("");
    setCoverImageUrl("");
    setYear("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl text-white font-semibold mb-4">
        Add New Book to Library
      </h2>
      {/* Main Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-3 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-teal-500"
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="p-3 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-teal-500"
        />
      </div>
      {/* Secondary Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Cover Image URL (Optional)"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          className="p-3 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-teal-500"
        />
        <input
          type="number"
          placeholder="Year Published (Optional)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min="0"
          className="p-3 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-teal-500"
        />
        <input
          type="number"
          placeholder="Total Pages"
          value={totalPages}
          onChange={(e) => setTotalPages(e.target.value)}
          required
          min="1"
          className="p-3 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-teal-500"
        />
      </div>
      <button
        type="submit"
        className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition duration-300"
      >
        Add Book
      </button>
    </form>
  );
};

export default AddBookForm;

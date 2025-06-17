// src/components/books/AddBookForm.jsx
import { useState } from "react";

const AddBookForm = ({ onAddBook }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || !totalPages) return;
    onAddBook({ title, author, totalPages: Number(totalPages) });
    setTitle("");
    setAuthor("");
    setTotalPages("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl text-white font-semibold mb-4">
        Add New Book to Library
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="md:col-span-2 p-3 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-teal-500"
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
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

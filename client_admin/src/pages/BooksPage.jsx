// src/pages/BooksPage.jsx
import { useState, useEffect } from "react";
import api from "../services/api";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get("/books");
        setBooks(response.data.data);
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setError("Failed to fetch your book collection.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div>
      <h1 className="text-3xl font-bold text-teal-400 mb-6">Book Tracker</h1>
      {loading && <p className="text-gray-400">Loading your library...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div>
          {/* We will replace this with our components soon */}
          <pre className="text-white bg-gray-800 p-4 rounded-md">
            {JSON.stringify(books, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default BooksPage;

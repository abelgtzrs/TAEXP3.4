// src/pages/BooksPage.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AddBookForm from "../components/books/AddBookForm";
import BookItem from "../components/books/BookItem";
import PageHeader from "../components/ui/PageHeader";
import { Link } from "react-router-dom";

const BooksPage = () => {
  const { user, setUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get("/books");
        // Sort books: unfinished first, then by most recently updated
        const sortedBooks = response.data.data.sort(
          (a, b) => a.isFinished - b.isFinished || new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setBooks(sortedBooks);
      } catch (err) {
        setError("Failed to fetch your book collection.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // --- Handler Functions ---

  // Generic helper to process API response and update state
  const processApiResponse = (response) => {
    const updatedBook = response.data.data;
    // Update the book in our local list
    setBooks((prevBooks) => prevBooks.map((b) => (b._id === updatedBook._id ? updatedBook : b)));

    // --- THIS IS THE FIX ---
    // Check if the API response included our updated user data.
    if (response.data.userData) {
      // If it did, it means a reward was given.
      // We use setUser to update the ENTIRE global user object with the fresh,
      // correct data directly from the server. This state will persist.
      setUser(response.data.userData);
    }
  };

  const handleAddBook = async (bookData) => {
    setFormLoading(true);
    try {
      const response = await api.post("/books", bookData);
      // Add new book to the top of the list
      setBooks((prevBooks) => [response.data.data, ...prevBooks]);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add book.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to remove this book?")) {
      try {
        await api.delete(`/books/${bookId}`);
        setBooks(books.filter((b) => b._id !== bookId));
      } catch (err) {
        setError("Could not delete book.");
      }
    }
  };

  // Generic update function for pagesRead
  const handleUpdateBook = async (bookId, updateData) => {
    try {
      const response = await api.put(`/books/${bookId}`, updateData);
      processApiResponse(response); // Use the helper
    } catch (err) {
      setError("Could not update book progress.");
    }
  };

  // Specific function for the "Mark as Finished" button
  const handleFinishBook = async (bookId) => {
    try {
      console.log("Attempting to finish book with ID:", bookId);
      const response = await api.put(`/books/${bookId}`, {
        isFinished: true,
        finishedAt: new Date().toISOString(), // Explicitly mark when the book was finished
      });

      // Add detailed debugging to see what the server returns
      console.log("Full finish book response:", response);
      console.log("Response data:", response.data);
      console.log("Response success:", response.data.success);
      console.log("Response message:", response.data.message);

      if (response.data.userData) {
        console.log("Updated user data received:", response.data.userData);
        console.log("New Wendy Hearts:", response.data.userData.wendyHearts);
      } else {
        console.log("No user data returned from server - book may have already been finished");
      }

      processApiResponse(response); // Use the helper
    } catch (err) {
      console.error("Error finishing book:", err);
      setError("Could not mark book as finished.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <PageHeader title="Book Tracker" subtitle="Manage your personal library and track your reading progress." />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-right mb-6 -mt-12"
      >
        <p className="text-lg text-white">
          Wendy Hearts: <span className="font-bold text-pink-400">{user?.wendyHearts || 0} ❤️</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      >
        <AddBookForm onAddBook={handleAddBook} loading={formLoading} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex items-center justify-between mt-10 mb-4"
      >
        <h2 className="text-2xl font-semibold text-white">Your Library</h2>
        <p className="text-xs text-text-tertiary hidden md:block">
          Tip: Hover or focus the cover to see full details. Use ⚙️ to open the interaction & notes workspace.
        </p>
      </motion.div>

      {loading && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-text-secondary py-8">
          Loading...
        </motion.p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center text-status-danger py-8"
        >
          {error}
        </motion.p>
      )}

      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-6"
        >
          {books.length > 0 ? (
            books.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              >
                <BookItem
                  book={book}
                  onUpdate={handleUpdateBook}
                  onDelete={handleDeleteBook}
                  onFinish={handleFinishBook}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="text-center text-text-secondary py-8"
            >
              Your library is empty. Add a book above to start tracking!
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default BooksPage;

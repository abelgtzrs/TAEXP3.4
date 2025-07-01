// src/pages/BooksPage.jsx
import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AddBookForm from "../components/books/AddBookForm";
import BookItem from "../components/books/BookItem";
import PageHeader from "../components/ui/PageHeader";

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

  const handleAddBook = async (bookData) => {
    try {
      const response = await api.post("/books", bookData);
      setBooks([response.data.data, ...books]); // Add new book to the top of the list
    } catch (err) {
      setError("Could not add book.");
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to remove this book from your library?")) {
      try {
        await api.delete(`/books/${bookId}`);
        setBooks(books.filter((b) => b._id !== bookId)); // Remove from UI state
      } catch (err) {
        setError("Could not delete book.");
      }
    }
  };

  // Generic update function (for pagesRead)
  const handleUpdateBook = async (bookId, updateData) => {
    try {
      const response = await api.put(`/books/${bookId}`, updateData);
      // After any update, check for rewards (the backend response will tell us if it was a "finish" event)
      handleRewardResponse(response);
    } catch (err) {
      setError("Could not update book progress.");
    }
  };

  // Specific function for the "Mark as Finished" button
  const handleFinishBook = async (bookId) => {
    try {
      const response = await api.put(`/books/${bookId}`, { isFinished: true });
      handleRewardResponse(response);
    } catch (err) {
      setError("Could not mark book as finished.");
    }
  };

  // Helper to process API response and update state
  const handleRewardResponse = (response) => {
    const updatedBook = response.data.data;
    // Update the book in our local list
    setBooks(books.map((b) => (b._id === updatedBook._id ? updatedBook : b)));

    // If the API response included a special message, it means we got a reward.
    // Let's update the global user state.
    if (response.data.message && response.data.message.includes("Book finished!")) {
      const WENDY_HEARTS_AWARD = 25; // As defined in the backend
      const BOOK_FINISH_XP = 150; // As defined in the backend
      setUser((prevUser) => ({
        ...prevUser,
        wendyHearts: (prevUser.wendyHearts || 0) + WENDY_HEARTS_AWARD,
        experience: (prevUser.experience || 0) + BOOK_FINISH_XP,
      }));
      // We could also parse the rewards from the message string, but this is simpler for now.
    }
  };

  return (
    <div>
      <PageHeader title="Book Tracker" subtitle="Manage your personal library and track your reading progress." />
      <div className="text-right mb-6 -mt-12">
        <p className="text-lg text-white">
          Wendy Hearts: <span className="font-bold text-pink-400">{user?.wendyHearts || 0} ❤️</span>
        </p>
      </div>

      <AddBookForm onAddBook={handleAddBook} loading={formLoading} />

      <h2 className="text-2xl font-semibold text-white mt-10 mb-4">Your Library</h2>
      {loading && <p className="text-center text-text-secondary py-8">Loading...</p>}
      {error && <p className="text-center text-status-danger py-8">{error}</p>}

      {!loading && !error && (
        <div className="space-y-6">
          {books.length > 0 ? (
            books.map((book) => (
              <BookItem
                key={book._id}
                book={book}
                onUpdate={handleUpdateBook}
                onDelete={handleDeleteBook}
                onFinish={handleFinishBook}
              />
            ))
          ) : (
            <div className="text-center text-text-secondary py-8">
              Your library is empty. Add a book above to start tracking!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BooksPage;

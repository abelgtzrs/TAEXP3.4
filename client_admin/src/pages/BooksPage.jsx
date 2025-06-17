// src/pages/BooksPage.jsx
import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AddBookForm from "../components/books/AddBookForm";
import BookItem from "../components/books/BookItem";

const BooksPage = () => {
  const { user, setUser } = useAuth(); // Get user state and setter from context
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get("/books");
        // Sort books: unfinished first, then by most recently updated
        const sortedBooks = response.data.data.sort(
          (a, b) =>
            a.isFinished - b.isFinished ||
            new Date(b.updatedAt) - new Date(a.updatedAt)
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
    if (
      window.confirm(
        "Are you sure you want to remove this book from your library?"
      )
    ) {
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
    if (
      response.data.message &&
      response.data.message.includes("Book finished!")
    ) {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-400">Book Tracker</h1>
        <div className="text-right">
          <p className="text-lg text-white">
            Wendy Hearts:{" "}
            <span className="font-bold text-pink-400">
              {user?.wendyHearts || 0} ❤️
            </span>
          </p>
          <p className="text-xs text-gray-400">Earned from reading books</p>
        </div>
      </div>

      <AddBookForm onAddBook={handleAddBook} />

      {loading && (
        <p className="text-center text-gray-400 py-8">
          Loading your library...
        </p>
      )}
      {error && <p className="text-center text-red-500 py-8">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
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
            <p className="text-center text-gray-500 py-8">
              Your library is empty. Add a book above to start tracking!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BooksPage;

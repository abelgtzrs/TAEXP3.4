// src/components/books/AddBookForm.jsx
import { useState } from "react";
import Widget from "../ui/Widget"; // Use the Widget component for consistent card styling
import StyledInput from "../ui/StyledInput";
import StyledButton from "../ui/StyledButton";

const AddBookForm = ({ onAddBook, loading }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || !totalPages) return;
    onAddBook({ title, author, totalPages: Number(totalPages), coverImageUrl, year: year ? Number(year) : undefined });
    // Reset form
    setTitle("");
    setAuthor("");
    setTotalPages("");
    setCoverImageUrl("");
    setYear("");
  };

  return (
    <Widget title="Add New Book to Library">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <StyledInput
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <StyledInput
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StyledInput
            type="text"
            placeholder="Cover Image URL (Optional)"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
          />
          <StyledInput
            type="number"
            placeholder="Year Published (Optional)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="0"
          />
          <StyledInput
            type="number"
            placeholder="Total Pages"
            value={totalPages}
            onChange={(e) => setTotalPages(e.target.value)}
            required
            min="1"
          />
        </div>
        <StyledButton type="submit" loading={loading} className="w-full mt-4">
          Add Book
        </StyledButton>
      </form>
    </Widget>
  );
};

export default AddBookForm;

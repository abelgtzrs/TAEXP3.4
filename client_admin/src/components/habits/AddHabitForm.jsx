import { useState } from "react";
import StyledInput from "../ui/StyledInput"; // Assuming you have this from our styling phase
import StyledButton from "../ui/StyledButton";

const AddHabitForm = ({ onAddHabit, loading }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddHabit({ name, description });
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-lg border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-primary)' }}>
      <h2 className="text-xl text-text-main font-semibold mb-4">Add New Habit</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <StyledInput
          type="text"
          placeholder="Habit Name (e.g., Read for 15 minutes)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <StyledInput
          type="text"
          placeholder="Optional Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <StyledButton type="submit" disabled={loading} className="py-3 px-6 bg-primary hover:opacity-90 text-white">
          {loading ? "Adding..." : "Add Habit"}
        </StyledButton>
      </div>
    </form>
  );
};

export default AddHabitForm;

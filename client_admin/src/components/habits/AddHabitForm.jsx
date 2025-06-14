// src/components/habits/AddHabitForm.jsx
import { useState } from "react";

// This component receives the `onAddHabit` function as a prop from its parent.
const AddHabitForm = ({ onAddHabit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return; // Don't add empty habits

    // Call the function passed down from the parent (HabitsPage)
    onAddHabit({ name, description });

    // Clear the form fields after submission
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl text-white font-semibold mb-4">Add New Habit</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Habit Name (e.g., Read for 15 minutes)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-grow p-3 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-teal-500"
          required
        />
        <input
          type="text"
          placeholder="Optional Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-grow p-3 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-teal-500"
        />
        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
        >
          Add Habit
        </button>
      </div>
    </form>
  );
};

export default AddHabitForm;

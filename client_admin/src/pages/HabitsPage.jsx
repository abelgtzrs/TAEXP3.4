// src/pages/HabitsPage.jsx
import { useState, useEffect } from "react";
import api from "../services/api"; // Our configured axios instance
import { useAuth } from "../context/AuthContext"; // To update user currency/XP
import AddHabitForm from "../components/habits/AddHabitForm";
import HabitItem from "../components/habits/HabitItem";

const HabitsPage = () => {
  // We get the full 'user' object and a function to update it from our AuthContext
  const { user, setUser } = useAuth();

  // State to hold the list of habits
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // This function runs once when the component loads to fetch habits
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setLoading(true);
        const response = await api.get("/habits");
        setHabits(response.data.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch habits. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []); // Empty array means it runs only on mount

  // --- Handler Functions ---

  // Function to handle creating a new habit
  const handleAddHabit = async (habitData) => {
    try {
      const response = await api.post("/habits", habitData);
      // Add the new habit to the start of our habits list in the UI
      setHabits([response.data.data, ...habits]);
    } catch (err) {
      console.error("Failed to add habit:", err);
      setError("Could not add habit.");
    }
  };

  // Function to handle completing a habit
  const handleCompleteHabit = async (habitId) => {
    try {
      const response = await api.post(`/habits/${habitId}/complete`);
      const updatedHabit = response.data.habitData;

      // Update the specific habit in our local state
      setHabits(habits.map((h) => (h._id === habitId ? updatedHabit : h)));

      if (response.data.userData) {
        setUser((prevUser) => ({ ...prevUser, ...response.data.userData }));
      }
    } catch (err) {
      console.error("Failed to complete habit:", err);
      setError(err.response?.data?.message || "Could not complete habit.");
    }
  };

  // Function to handle deleting a habit
  const handleDeleteHabit = async (habitId) => {
    // Optional: Add a confirmation dialog
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        await api.delete(`/habits/${habitId}`);
        // Filter out the deleted habit from our local state
        setHabits(habits.filter((h) => h._id !== habitId));
      } catch (err) {
        console.error("Failed to delete habit:", err);
        setError("Could not delete habit.");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-400">Habit Tracker</h1>
        {/* Display user's TemuTokens balance */}
        <div className="text-right">
          <p className="text-lg text-white">
            Temu Tokens:{" "}
            <span className="font-bold text-yellow-400">
              {user?.temuTokens || 0}
            </span>
          </p>
          <p className="text-xs text-gray-400">Earned from completing habits</p>
        </div>
      </div>

      <AddHabitForm onAddHabit={handleAddHabit} />

      {loading && <p className="text-gray-400">Loading habits...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          {habits.length > 0 ? (
            habits.map((habit) => (
              <HabitItem
                key={habit._id}
                habit={habit}
                onComplete={handleCompleteHabit}
                onDelete={handleDeleteHabit}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              You haven't added any habits yet. Add one above to get started!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HabitsPage;

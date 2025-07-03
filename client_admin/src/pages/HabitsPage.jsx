import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AddHabitForm from "../components/habits/AddHabitForm";
import HabitItem from "../components/habits/HabitItem";
import PageHeader from "../components/ui/PageHeader";

const HabitsPage = () => {
  const { user, setUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await api.get("/habits");
      // Ensure we only store valid data
      setHabits(response.data.data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch habits. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleAddHabit = async (habitData) => {
    setFormLoading(true);
    try {
      const response = await api.post("/habits", habitData);
      setHabits([response.data.data, ...habits]);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add habit.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      const response = await api.post(`/habits/${habitId}/complete`);
      const updatedHabit = response.data.data;
      const updatedUserData = response.data.userData;

      setHabits(habits.map((h) => (h._id === habitId ? updatedHabit : h)));

      if (updatedUserData) {
        setUser((prevUser) => ({ ...prevUser, ...updatedUserData }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not complete habit.");
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        await api.delete(`/habits/${habitId}`);
        setHabits(habits.filter((h) => h._id !== habitId));
      } catch (err) {
        setError("Could not delete habit.");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Habit Tracker" subtitle="Build consistency, earn rewards." />
        <div className="text-right">
          <p className="text-lg text-white">
            Temu Tokens: <span className="font-bold text-yellow-400">{user?.temuTokens || 0}</span>
          </p>
          <p className="text-xs text-gray-400">Earned from completing habits</p>
        </div>
      </div>

      <AddHabitForm onAddHabit={handleAddHabit} loading={formLoading} />

      <h2 className="text-2xl font-semibold text-white mt-10 mb-4">Your Habits</h2>
      {loading && <p className="text-center text-gray-500 py-8">Loading habits...</p>}
      {error && <p className="text-center text-red-500 py-8">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          {habits.length > 0 ? (
            // --- THIS IS THE FIX ---
            // We add .filter(Boolean) to safely remove any null or undefined entries
            // from the array before we try to render them.
            habits
              .filter(Boolean)
              .map((habit) => (
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

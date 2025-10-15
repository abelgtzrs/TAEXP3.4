import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
      console.log("Attempting to complete habit with ID:", habitId);
      const response = await api.post(`/habits/${habitId}/complete`);
      console.log("Habit completion response:", response.data);

      // Fix: Use habitData instead of data to match backend response
      const updatedHabit = response.data.habitData || response.data.data;
      const updatedUserData = response.data.userData;

      setHabits(habits.map((h) => (h._id === habitId ? updatedHabit : h)));

      if (updatedUserData) {
        console.log("Updating user with:", updatedUserData);
        setUser((prevUser) => ({ ...prevUser, ...updatedUserData }));
      }
    } catch (err) {
      console.error("Habit completion error:", err);
      console.error("Error response:", err.response?.data);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-between items-center mb-6"
      >
        <PageHeader title="Habit Tracker" subtitle="Build consistency, earn rewards." />
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-right"
        >
          <p className="text-lg text-text-main">
            Temu Tokens: <span className="font-bold text-primary">{user?.temuTokens || 0}</span>
          </p>
          <p className="text-xs text-text-secondary">Earned from completing habits</p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      >
        <AddHabitForm onAddHabit={handleAddHabit} loading={formLoading} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-2xl font-semibold text-primary mt-10 mb-4"
      >
        Your Habits
      </motion.h2>

      {loading && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-text-secondary py-8">
          Loading habits...
        </motion.p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center text-red-500 py-8"
        >
          {error}
        </motion.p>
      )}

      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-4"
        >
          {habits.length > 0 ? (
            // --- THIS IS THE FIX ---
            // We add .filter(Boolean) to safely remove any null or undefined entries
            // from the array before we try to render them.
            habits.filter(Boolean).map((habit, index) => (
              <motion.div
                key={habit._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              >
                <HabitItem habit={habit} onComplete={handleCompleteHabit} onDelete={handleDeleteHabit} />
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="text-center text-text-secondary py-8"
            >
              You haven't added any habits yet. Add one above to get started!
            </motion.p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default HabitsPage;

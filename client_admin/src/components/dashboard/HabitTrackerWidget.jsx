import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Widget from "./Widget";
import { CheckSquare } from "lucide-react";

const HabitTrackerWidget = () => {
  const [habits, setHabits] = useState([]);
  const { setUser } = useAuth();

  const fetchHabits = async () => {
    try {
      const response = await api.get("/habits");
      setHabits(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch habits for widget:", error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleCompleteHabit = async (habitId) => {
    try {
      const response = await api.post(`/habits/${habitId}/complete`);
      const updatedHabit = response.data.data;
      const updatedUserData = response.data.userData;

      setHabits((prev) => prev.map((h) => (h?._id === habitId ? updatedHabit : h)));

      if (updatedUserData) {
        setUser((prevUser) => ({ ...prevUser, ...updatedUserData }));
      }
    } catch (err) {
      console.error("Failed to complete habit from widget:", err);
      alert(err.response?.data?.message || "Could not complete habit.");
    }
  };

  const isCompletedToday = (habit) => {
    if (!habit || !habit.lastCompletedDate) {
      return false;
    }
    const today = new Date();
    const lastCompletion = new Date(habit.lastCompletedDate);
    return today.toDateString() === lastCompletion.toDateString();
  };

  // --- THIS IS THE FIX ---
  // We add .filter(Boolean) here as well to ensure we don't process invalid habit entries.
  const uncompletedHabits = habits
    .filter(Boolean)
    .filter((h) => !isCompletedToday(h))
    .slice(0, 5);

  return (
    <Widget title="Today's Directives">
      <div className="space-y-3">
        {uncompletedHabits.length > 0 ? (
          uncompletedHabits.map((habit) => (
            <div key={habit._id} className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">{habit.name}</span>
              <button
                onClick={() => handleCompleteHabit(habit._id)}
                className="p-1 text-gray-500 hover:text-status-success"
              >
                <CheckSquare size={18} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-text-tertiary">All habits completed for today!</p>
        )}
      </div>
      <Link to="/habits" className="text-sm text-primary hover:underline mt-4 block text-right">
        View All Habits &rarr;
      </Link>
    </Widget>
  );
};

export default HabitTrackerWidget;

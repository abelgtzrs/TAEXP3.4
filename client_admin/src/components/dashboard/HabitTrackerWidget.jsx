import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Widget from "../ui/Widget";
import { CheckSquare } from "lucide-react";

const HabitTrackerWidget = () => {
  const [habits, setHabits] = useState([]);
  const { setUser, user } = useAuth();

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

  // Show up to 10 habits, completed or not
  const shownHabits = habits.filter(Boolean).slice(0, 10);

  return (
    <Widget title="Today's Directives" className="h-auto">
      <div className="space-y-2">
        {shownHabits.length > 0 ? (
          shownHabits.map((habit, index) => {
            const completed = isCompletedToday(habit);
            const bgColors = [
              "bg-slate-800/30",
              "bg-blue-900/20",
              "bg-purple-900/20",
              "bg-green-900/20",
              "bg-amber-900/20",
              "bg-red-900/20",
              "bg-cyan-900/20",
              "bg-pink-900/20",
              "bg-indigo-900/20",
              "bg-teal-900/20",
            ];
            const bgColor = bgColors[index % bgColors.length];

            return (
              <div
                key={habit._id}
                className={`flex items-center justify-between text-sm py-2 px-3 rounded-lg ${bgColor} border border-gray-700/50`}
              >
                <span className={completed ? "text-text-main line-through" : "text-text-secondary"}>{habit.name}</span>
                <button
                  onClick={() => handleCompleteHabit(habit._id)}
                  className={`p-2 rounded ${
                    completed ? "text-status-success" : "text-gray-200 hover:text-status-success"
                  }`}
                  disabled={completed}
                  aria-label={completed ? "Completed" : "Mark as complete"}
                >
                  <CheckSquare size={20} />
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-text-tertiary py-2">All habits completed for today!</p>
        )}
      </div>
      <Link to="/habits" className="text-sm text-primary hover:underline mt-4 block text-right">
        View All Habits &rarr;
      </Link>
    </Widget>
  );
};

export default HabitTrackerWidget;

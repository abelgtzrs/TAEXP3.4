import { Trash2 } from "lucide-react";

const HabitItem = ({ habit, onComplete, onDelete }) => {
  // Helper function to check if the habit was already completed today
  const isCompletedToday = () => {
    if (!habit || !habit.lastCompletedDate) return false;
    return new Date(habit.lastCompletedDate).toDateString() === new Date().toDateString();
  };

  const completed = isCompletedToday();

  return (
    <div
      className={`p-4 rounded-lg shadow-md flex items-center justify-between transition-all duration-300 ${
        completed ? "bg-green-900/50 border-green-500/50" : "bg-gray-800/70 border-gray-700/50"
      } border`}
    >
      <div>
        <h3 className={`text-lg font-medium ${completed ? "text-green-300 line-through" : "text-white"}`}>
          {habit.name}
        </h3>
        <p className="text-sm text-gray-400">
          Current Streak: <span className="text-teal-400 font-bold">{habit.streak} days 🔥</span>
        </p>
        {habit.description && <p className="text-xs text-gray-500 mt-1">{habit.description}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onComplete(habit._id)}
          disabled={completed}
          className={`font-semibold py-2 px-4 rounded-md text-sm transition-colors duration-300 ${
            completed ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-500 text-white"
          }`}
        >
          {completed ? "Done ✅" : "Complete"}
        </button>
        <button
          onClick={() => onDelete(habit._id)}
          className="p-2 text-gray-500 hover:text-red-500"
          title="Delete Habit"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default HabitItem;

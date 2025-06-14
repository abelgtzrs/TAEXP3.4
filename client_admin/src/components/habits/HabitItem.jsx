// src/components/habits/HabitItem.jsx

// This component displays a single habit. It receives the habit data
// and functions to handle actions as props.
const HabitItem = ({ habit, onComplete, onDelete }) => {
  // Helper to check if the habit was already completed today
  const isCompletedToday = () => {
    if (!habit.lastCompletedDate) return false;
    const today = new Date();
    const lastCompletion = new Date(habit.lastCompletedDate);
    return today.toDateString() === lastCompletion.toDateString();
  };

  const completed = isCompletedToday();

  return (
    <div
      className={`p-4 rounded-lg shadow-md flex items-center justify-between transition-all duration-300 ${
        completed
          ? "bg-green-900/50 border-green-500/50"
          : "bg-gray-800/70 border-gray-700/50"
      } border`}
    >
      <div>
        <h3
          className={`text-lg font-medium ${
            completed ? "text-green-300 line-through" : "text-white"
          }`}
        >
          {habit.name}
        </h3>
        <p className="text-sm text-gray-400">
          Current Streak:{" "}
          <span className="text-teal-400 font-bold">
            {habit.streak} days 🔥
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onComplete(habit._id)}
          disabled={completed}
          className={`font-semibold py-2 px-4 rounded-md text-sm transition-colors duration-300 ${
            completed
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500 text-white"
          }`}
        >
          {completed ? "Done ✅" : "Complete"}
        </button>
        <button
          onClick={() => onDelete(habit._id)}
          className="bg-red-800 hover:bg-red-700 text-white font-bold p-2 rounded-full text-xs"
          title="Delete Habit"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default HabitItem;

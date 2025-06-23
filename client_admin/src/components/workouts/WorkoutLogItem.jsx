const WorkoutLogItem = ({ log }) => {
  // Format the date to be more readable, e.g., "June 21, 2025"
  const formattedDate = new Date(log.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-4 bg-gray-800/70 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">{formattedDate}</p>
          <h3 className="text-xl font-bold text-teal-400">{log.workoutName}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-300">
            {log.exercises.length} Exercises
          </p>
          <p className="text-sm text-gray-300">
            {log.durationSessionMinutes || "N/A"} mins
          </p>
        </div>
      </div>
      <ul className="mt-4 text-xs text-gray-300 list-disc list-inside space-y-1">
        {log.exercises.map((ex, index) => (
          <li key={index}>
            <span className="font-semibold">
              {ex.exerciseDefinition?.name || "Unknown Exercise"}
            </span>
            : {ex.sets.length} sets
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutLogItem;

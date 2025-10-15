const WorkoutLogItem = ({ log }) => {
  // Format the date to be more readable, e.g., "June 21, 2025"
  const formattedDate = new Date(log.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="p-4 rounded-lg border"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-text-secondary">{formattedDate}</p>
          <h3 className="text-xl font-bold text-primary">{log.workoutName}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-main">{log.exercises.length} Exercises</p>
          <p className="text-sm text-text-main">{log.durationSessionMinutes || "N/A"} mins</p>
        </div>
      </div>
      <ul className="mt-4 text-xs text-text-main list-disc list-inside space-y-1">
        {log.exercises.map((ex, index) => (
          <li key={index}>
            <span className="font-semibold">{ex.exerciseDefinition?.name || "Unknown Exercise"}</span>: {ex.sets.length}{" "}
            sets
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutLogItem;

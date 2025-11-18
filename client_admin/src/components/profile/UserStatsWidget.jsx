import Widget from "../ui/Widget";

const StatItem = ({ label, value }) => (
  <div className="flex justify-between items-baseline py-2 border-b border-gray-700/50">
    <span className="text-sm text-text-secondary">{label}</span>
    <span className="text-lg font-semibold font-mono text-white">{value}</span>
  </div>
);

const UserStatsWidget = ({ stats }) => {
  // Normalize incoming stats keys for backward compatibility
  const habitsCompleted = stats.totalHabitsCompleted ?? stats.habitsCompleted ?? stats.habitsCompletedToday ?? 0;
  const longestStreak = stats.longestLoginStreak ?? stats.longestStreak ?? 0;
  return (
    <Widget title="Lifetime Statistics" className="h-full">
      <div className="space-y-2">
        <StatItem label="Habits Completed Today" value={habitsCompleted} />
        <StatItem label="Workouts Logged" value={stats.totalWorkouts ?? 0} />
        <StatItem label="Books Finished" value={stats.booksFinished ?? 0} />
        <StatItem label="Gacha Pulls" value={stats.gachaPulls ?? 0} />
        <StatItem label="Current Login Streak" value={`${stats.activeStreaks ?? 0} days`} />
        <StatItem label="Longest Login Streak" value={`${longestStreak} days`} />
        <StatItem label="Volumes Published" value={stats.volumesPublished ?? 0} />
      </div>
    </Widget>
  );
};

export default UserStatsWidget;

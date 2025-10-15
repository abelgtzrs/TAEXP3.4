import Widget from "../ui/Widget";

const StatItem = ({ label, value }) => (
  <div className="flex justify-between items-baseline py-2 border-b border-gray-700/50">
    <span className="text-sm text-text-secondary">{label}</span>
    <span className="text-lg font-semibold font-mono text-white">{value}</span>
  </div>
);

const UserStatsWidget = ({ stats }) => {
  return (
    <Widget title="Lifetime Statistics" className="h-full">
      <div className="space-y-2">
        <StatItem label="Habits Completed" value={stats.totalHabitsCompleted || 0} />
        <StatItem label="Workouts Logged" value={stats.totalWorkouts || 0} />
        <StatItem label="Books Finished" value={stats.booksFinished || 0} />
        <StatItem label="Gacha Pulls" value={stats.gachaPulls || 0} />
        <StatItem label="Longest Login Streak" value={`${stats.longestLoginStreak || 0} days`} />
        <StatItem label="Volumes Published" value={stats.volumesPublished || 0} />
      </div>
    </Widget>
  );
};

export default UserStatsWidget;

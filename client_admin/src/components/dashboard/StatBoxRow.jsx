import StatBox from "./StatBox";

const StatBoxRow = ({ stats, loading }) => {
  return (
    <div className="bg-surface border border-gray-700/50 rounded-lg flex flex-col lg:flex-row">
      <StatBox
        title="Habits Completed Today"
        value={loading ? "..." : stats.habitsCompleted}
        change="+5.0%"
        changeType="increase"
        period="yesterday"
      />
      <StatBox
        title="Total Workouts"
        value={loading ? "..." : stats.totalWorkouts}
        change="+2"
        changeType="increase"
        period="last week"
      />
      <StatBox
        title="Books Finished"
        value={loading ? "..." : stats.booksFinished}
        change="-1"
        changeType="decrease"
        period="last month"
      />
      <StatBox
        title="Login Streak"
        value={loading ? "..." : stats.activeStreaks}
        change="+1"
        changeType="increase"
        period="today"
      />
      <StatBox
        title="Total Collectibles"
        value={loading ? "..." : stats.gachaPulls}
        change="+12"
        changeType="increase"
        period="this week"
      />
      <StatBox
        title="Volumes Published"
        value={loading ? "..." : stats.volumesPublished}
        change="+0"
        changeType="increase"
        period="this quarter"
      />
    </div>
  );
};

export default StatBoxRow;

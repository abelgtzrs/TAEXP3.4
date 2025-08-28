import StatBox from "./StatBox";

const StatBoxRow = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      <div className="bg-surface border border-gray-700/50 rounded-lg">
        <StatBox
          title="Habits Completed Today"
          value={loading ? "..." : stats.habitsCompleted}
          change="+5.0%"
          changeType="increase"
          period="yesterday"
        />
      </div>
      <div className="bg-surface border border-gray-700/50 rounded-lg">
        <StatBox
          title="Total Workouts"
          value={loading ? "..." : stats.totalWorkouts}
          change="+2"
          changeType="increase"
          period="last week"
        />
      </div>
      <div className="bg-surface border border-gray-700/50 rounded-lg">
        <StatBox
          title="Books Finished"
          value={loading ? "..." : stats.booksFinished}
          change="-1"
          changeType="decrease"
          period="last month"
        />
      </div>
      <div className="bg-surface border border-gray-700/50 rounded-lg">
        <StatBox
          title="Login Streak"
          value={loading ? "..." : stats.activeStreaks}
          change="+1"
          changeType="increase"
          period="today"
        />
      </div>
      <div className="bg-surface border border-gray-700/50 rounded-lg">
        <StatBox
          title="Total Collectibles"
          value={loading ? "..." : stats.gachaPulls}
          change="+12"
          changeType="increase"
          period="this week"
        />
      </div>
      <div className="bg-surface border border-gray-700/50 rounded-lg">
        <StatBox
          title="Volumes Published"
          value={loading ? "..." : stats.volumesPublished}
          change="+0"
          changeType="increase"
          period="this quarter"
        />
      </div>
      <div className="bg-surface border border-gray-700/50 rounded-lg">
        <StatBox
          title="Tasks Completed"
          value={loading ? "..." : stats.tasksCompleted}
          change="+8"
          changeType="increase"
          period="today"
        />
      </div>
      <div className="bg-surface border border-gray-700/50 rounded-lg">
        <StatBox
          title="Active Goals"
          value={loading ? "..." : stats.activeGoals}
          change="+1"
          changeType="increase"
          period="this month"
        />
      </div>
    </div>
  );
};

export default StatBoxRow;

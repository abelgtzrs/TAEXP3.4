import StatBox from "./StatBox";
import useStatTrend from "../../hooks/useStatTrend";

const StatBoxRow = ({ stats, loading }) => {
  // Define the stats we want to show along with their keys and labels
  const items = [
    { key: "habitsCompleted", title: "Habits Completed" },
    { key: "totalWorkouts", title: "Total Workouts" },
    { key: "booksFinished", title: "Books Finished" },
    { key: "activeStreaks", title: "Login Streak" },
    { key: "gachaPulls", title: "Total Collectibles" },
    { key: "volumesPublished", title: "Volumes Published" },
    { key: "tasksCompleted", title: "Tasks Completed" },
    { key: "activeGoals", title: "Active Goals" },
  ];

  return (
    <div className="widget-container border border-white/10">
      <div className="flex flex-col md:flex-row gap-1">
        {items.map((it, idx) => {
          const val = loading ? "..." : stats?.[it.key] ?? 0;
          const { trend, change, changeType, period } = useStatTrend(it.key, Number(stats?.[it.key] ?? 0), {
            horizon: 14,
            periodLabel: "yesterday",
          });
          return (
            <StatBox
              key={it.key}
              title={it.title}
              value={val}
              change={change}
              changeType={changeType}
              period={period}
              trend={trend}
              compact
              showDivider={false}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StatBoxRow;

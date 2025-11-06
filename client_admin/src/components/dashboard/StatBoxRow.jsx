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
      {/* Mobile: super condensed 2 rows with 4 boxes per row (show first 8) */}
      <div className="md:hidden grid grid-cols-4 gap-1">
        {items.slice(0, 8).map((it) => {
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
      {/* Desktop and up: full row */}
      <div className="hidden md:flex md:flex-row gap-1">
        {items.map((it) => {
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

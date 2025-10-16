import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Widget from "../ui/Widget";
import StyledButton from "../ui/StyledButton";
import { Dumbbell, CalendarDays, ListChecks, Clock } from "lucide-react";

const WORKOUT_TEMPLATES = [
  { name: "Push Day", to: "/workouts/log?template=push" },
  { name: "Pull Day", to: "/workouts/log?template=pull" },
  { name: "Leg Day", to: "/workouts/log?template=legs" },
  { name: "Full Body", to: "/workouts/log?template=fullbody" },
];

const WorkoutTrackerWidget = () => {
  const [lastLog, setLastLog] = useState(null);

  const [weekly, setWeekly] = useState(null);
  const [timeframe, setTimeframe] = useState("week"); // week | month | year | all

  useEffect(() => {
    api
      .get("/workouts?limit=200")
      .then((res) => {
        const logs = Array.isArray(res.data?.data) ? res.data.data : [];
        if (logs.length > 0) {
          setLastLog(logs[0]);
        }
        // Store raw logs; we'll derive stats for the selected timeframe in render
        setWeekly({ rawLogs: logs });
      })
      .catch((err) => console.error("Failed to fetch workout logs:", err));
  }, []);

  const lastMeta = useMemo(() => {
    if (!lastLog) return null;
    const date = lastLog.date ? new Date(lastLog.date) : null;
    const now = new Date();
    const daysAgo = date ? Math.floor((now - date) / (1000 * 60 * 60 * 24)) : null;
    const exercises = Array.isArray(lastLog.exercises) ? lastLog.exercises : [];
    const totalExercises = exercises.length;
    const totalSets = exercises.reduce((acc, ex) => acc + (Array.isArray(ex.sets) ? ex.sets.length : 0), 0);
    const duration = lastLog.durationMinutes ?? lastLog.duration ?? null;
    return { date, daysAgo, totalExercises, totalSets, duration };
  }, [lastLog]);

  return (
    <Widget title="Workout Status">
      {lastLog ? (
        <div
          className="mb-4 rounded-lg border p-3"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="h-10 w-10 rounded-md flex items-center justify-center border"
              style={{ background: "var(--color-background)", borderColor: "var(--color-primary)" }}
            >
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-secondary">Last Logged Workout</p>
              <h4 className="text-base font-semibold text-text-main truncate">{lastLog.workoutName}</h4>
              {lastMeta?.date && (
                <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                  <CalendarDays className="h-4 w-4" />
                  <span>{lastMeta.date.toLocaleDateString()}</span>
                  {typeof lastMeta.daysAgo === "number" && (
                    <span className="ml-2 opacity-80">
                      {lastMeta.daysAgo === 0 ? "Today" : `${lastMeta.daysAgo}d ago`}
                    </span>
                  )}
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                <div
                  className="inline-flex items-center gap-1 px-2 py-1 rounded border text-xs"
                  style={{ background: "var(--color-background)", borderColor: "var(--color-primary)" }}
                  title="Total exercises in session"
                >
                  <ListChecks className="h-4 w-4 text-primary" />
                  <span className="text-text-main">{lastMeta?.totalExercises ?? 0} exercises</span>
                </div>
                <div
                  className="inline-flex items-center gap-1 px-2 py-1 rounded border text-xs"
                  style={{ background: "var(--color-background)", borderColor: "var(--color-primary)" }}
                  title="Total sets performed"
                >
                  <ListChecks className="h-4 w-4 text-primary" />
                  <span className="text-text-main">{lastMeta?.totalSets ?? 0} sets</span>
                </div>
                {lastMeta?.duration != null && (
                  <div
                    className="inline-flex items-center gap-1 px-2 py-1 rounded border text-xs"
                    style={{ background: "var(--color-background)", borderColor: "var(--color-primary)" }}
                    title="Session duration"
                  >
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-text-main">{lastMeta.duration} min</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-text-tertiary mb-4">No workouts logged yet.</p>
      )}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-text-secondary tracking-wide">Quick Start Templates</h3>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-2 mb-2">
        {WORKOUT_TEMPLATES.map((tpl) => (
          <Link key={tpl.name} to={tpl.to} className="block">
            <StyledButton className="w-full h-16 text-base font-semibold hover:opacity-95">
              <div className="flex items-center justify-center gap-2">
                <Dumbbell className="h-5 w-5" />
                <span>{tpl.name}</span>
              </div>
            </StyledButton>
          </Link>
        ))}
      </div>
      {/* Timeframe stats */}
      {weekly && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-text-secondary tracking-wide">Statistics</h3>
            <div
              className="inline-flex rounded-lg border overflow-hidden"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
            >
              {[
                { k: "week", label: "Week" },
                { k: "month", label: "Month" },
                { k: "year", label: "Year" },
                { k: "all", label: "All" },
              ].map((opt) => (
                <button
                  key={opt.k}
                  onClick={() => setTimeframe(opt.k)}
                  className={`px-2 py-1 text-xs ${
                    timeframe === opt.k ? "bg-primary text-white" : "text-text-main hover:bg-[var(--color-background)]"
                  }`}
                  aria-pressed={timeframe === opt.k}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {(() => {
            const logs = weekly.rawLogs || [];
            const today = new Date();
            const tzFix = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000);
            let days = [];

            const pushDay = (d) => {
              const key = tzFix(d).toISOString().slice(0, 10);
              days.push({ date: new Date(d), key, workouts: 0, sets: 0, minutes: 0 });
            };

            if (timeframe === "week") {
              const start = new Date(today);
              start.setHours(0, 0, 0, 0);
              start.setDate(start.getDate() - 6);
              for (let i = 0; i < 7; i++) {
                const d = new Date(start);
                d.setDate(start.getDate() + i);
                pushDay(d);
              }
            } else if (timeframe === "month") {
              const start = new Date(today.getFullYear(), today.getMonth(), 1);
              const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
              for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) pushDay(new Date(d));
            } else if (timeframe === "year") {
              // Aggregate by month for compact display
              const months = Array.from({ length: 12 }, (_, i) => ({ key: i, workouts: 0, sets: 0, minutes: 0 }));
              let summary = { workouts: 0, sets: 0, minutes: 0 };
              for (const log of logs) {
                if (!log?.date) continue;
                const d = new Date(log.date);
                if (d.getFullYear() !== today.getFullYear()) continue;
                const monthIdx = d.getMonth();
                const exs = Array.isArray(log.exercises) ? log.exercises : [];
                const sets = exs.reduce((acc, ex) => acc + (Array.isArray(ex.sets) ? ex.sets.length : 0), 0);
                const minutes = Number(log.durationSessionMinutes ?? log.duration ?? 0) || 0;
                months[monthIdx].workouts += 1;
                months[monthIdx].sets += sets;
                months[monthIdx].minutes += minutes;
                summary.workouts += 1;
                summary.sets += sets;
                summary.minutes += minutes;
              }
              const monthLabels = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
              const maxSets = Math.max(1, ...months.map((m) => m.sets));
              return (
                <>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <StatChip label="Workouts" value={summary.workouts} />
                    <StatChip label="Sets" value={summary.sets} />
                    <StatChip label="Minutes" value={summary.minutes} />
                  </div>
                  <MiniBar labels={monthLabels} data={months.map((m) => m.sets)} max={maxSets} />
                </>
              );
            } else {
              // All time: aggregate by year
              const byYear = new Map();
              for (const log of logs) {
                if (!log?.date) continue;
                const d = new Date(log.date);
                const y = d.getFullYear();
                const exs = Array.isArray(log.exercises) ? log.exercises : [];
                const sets = exs.reduce((acc, ex) => acc + (Array.isArray(ex.sets) ? ex.sets.length : 0), 0);
                const minutes = Number(log.durationSessionMinutes ?? log.duration ?? 0) || 0;
                if (!byYear.has(y)) byYear.set(y, { workouts: 0, sets: 0, minutes: 0 });
                const agg = byYear.get(y);
                agg.workouts += 1;
                agg.sets += sets;
                agg.minutes += minutes;
              }
              const years = Array.from(byYear.keys()).sort((a, b) => a - b);
              const arr = years.map((y) => ({ label: String(y).slice(-2), ...byYear.get(y) }));
              const maxSets = Math.max(1, ...arr.map((m) => m.sets));
              const totals = arr.reduce(
                (acc, x) => ({
                  workouts: acc.workouts + x.workouts,
                  sets: acc.sets + x.sets,
                  minutes: acc.minutes + x.minutes,
                }),
                { workouts: 0, sets: 0, minutes: 0 }
              );
              return (
                <>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <StatChip label="Workouts" value={totals.workouts} />
                    <StatChip label="Sets" value={totals.sets} />
                    <StatChip label="Minutes" value={totals.minutes} />
                  </div>
                  <MiniBar labels={arr.map((x) => x.label)} data={arr.map((x) => x.sets)} max={maxSets} />
                </>
              );
            }

            // For week/month we aggregate by day
            const indexByKey = Object.fromEntries(days.map((d, i) => [d.key, i]));
            let summary = { workouts: 0, sets: 0, minutes: 0 };
            for (const log of logs) {
              if (!log?.date) continue;
              const d = new Date(log.date);
              const key = tzFix(d).toISOString().slice(0, 10);
              const idx = indexByKey[key];
              if (idx === undefined) continue;
              const exs = Array.isArray(log.exercises) ? log.exercises : [];
              const sets = exs.reduce((acc, ex) => acc + (Array.isArray(ex.sets) ? ex.sets.length : 0), 0);
              const minutes = Number(log.durationSessionMinutes ?? log.duration ?? 0) || 0;
              days[idx].workouts += 1;
              days[idx].sets += sets;
              days[idx].minutes += minutes;
              summary.workouts += 1;
              summary.sets += sets;
              summary.minutes += minutes;
            }

            let labels;
            if (timeframe === "week") {
              labels = ["S", "M", "T", "W", "T", "F", "S"];
            } else if (timeframe === "month") {
              // Show labels roughly weekly to avoid overflow (1, 8, 15, 22, 29)
              labels = days.map((d, i) => (i % 7 === 0 ? d.date.getDate() : ""));
            } else {
              labels = days.map((d) => d.date.getDate());
            }
            const maxSets = Math.max(1, ...days.map((d) => d.sets));
            return (
              <>
                <div className="mb-3 flex flex-wrap gap-2">
                  <StatChip label="Workouts" value={summary.workouts} />
                  <StatChip label="Sets" value={summary.sets} />
                  <StatChip label="Minutes" value={summary.minutes} />
                </div>
                <MiniBar labels={labels} data={days.map((d) => d.sets)} max={maxSets} />
              </>
            );
          })()}
        </div>
      )}
      <Link to="/workouts/log">
        <StyledButton className="w-full mt-2 hover:opacity-95">Log Custom Workout</StyledButton>
      </Link>
    </Widget>
  );
};

export default WorkoutTrackerWidget;

// Small presentational helpers
const StatChip = ({ label, value }) => (
  <div
    className="inline-flex items-center gap-2 px-2 py-1 rounded border text-xs"
    style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
  >
    <span className="text-text-secondary">{label}</span>
    <span className="text-primary font-semibold">{value}</span>
  </div>
);

const MiniBar = ({ labels, data, max }) => (
  <div
    className="rounded-lg border p-3 overflow-hidden"
    style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
  >
    <div className="flex items-end gap-1 h-20 w-full">
      {data.map((v, i) => {
        const h = Math.round(((v || 0) / Math.max(1, max)) * 100);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <div className="w-full bg-[var(--color-background)] rounded">
              <div className="bg-primary rounded" style={{ height: `${Math.max(4, h)}%` }}></div>
            </div>
            <div className="text-[10px] text-text-secondary w-full text-center truncate">{labels[i]}</div>
          </div>
        );
      })}
    </div>
  </div>
);

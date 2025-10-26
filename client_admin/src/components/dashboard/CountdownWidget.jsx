import React from "react";
import Widget from "../ui/Widget";

const STORAGE_KEY = "tae.countdown";

function formatDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / (24 * 3600));
  const hours = Math.floor((total % (24 * 3600)) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${days}d ${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function defaultTarget() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0); // first of next month
  return next.toISOString();
}

export default function CountdownWidget() {
  const [target, setTarget] = React.useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || defaultTarget();
    } catch {
      return defaultTarget();
    }
  });
  const [remaining, setRemaining] = React.useState(0);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, target);
    } catch {}
  }, [target]);

  React.useEffect(() => {
    let raf;
    const tick = () => {
      const t = new Date(target).getTime();
      setRemaining(t - Date.now());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <Widget title="Countdown" className="h-[220px] overflow-hidden">
      <div className="space-y-3">
        <div className="text-center text-2xl font-mono">{formatDuration(remaining)}</div>
        <div className="text-xs text-center text-slate-400">until</div>
        <div className="flex items-center gap-2">
          <input
            type="datetime-local"
            className="flex-1 bg-background border border-gray-700/60 rounded px-2 py-1 text-xs"
            value={new Date(target).toISOString().slice(0, 16)}
            onChange={(e) => {
              const val = e.target.value;
              // Chrome supplies local time without seconds; reconstruct ISO
              const iso = new Date(val).toISOString();
              setTarget(iso);
            }}
          />
          <button
            className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-white"
            onClick={() => setTarget(defaultTarget())}
          >
            Next Month
          </button>
        </div>
      </div>
    </Widget>
  );
}

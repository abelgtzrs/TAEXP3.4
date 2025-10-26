import React from "react";
import Widget from "../ui/Widget";

const STORAGE_KEY = "tae.focusTimer";

function format(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function FocusTimerWidget() {
  const [state, setState] = React.useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw
        ? JSON.parse(raw)
        : { duration: 25 * 60 * 1000, remaining: 25 * 60 * 1000, running: false, lastTick: 0 };
    } catch {
      return { duration: 25 * 60 * 1000, remaining: 25 * 60 * 1000, running: false, lastTick: 0 };
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  React.useEffect(() => {
    if (!state.running) return;
    let raf;
    const tick = (t) => {
      setState((prev) => {
        const now = Date.now();
        const dt = prev.lastTick ? now - prev.lastTick : 0;
        const next = Math.max(0, prev.remaining - dt);
        return { ...prev, remaining: next, running: next > 0, lastTick: now };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state.running]);

  const start = () => setState((p) => ({ ...p, running: true, lastTick: Date.now() }));
  const pause = () => setState((p) => ({ ...p, running: false, lastTick: 0 }));
  const reset = () => setState((p) => ({ ...p, remaining: p.duration, running: false, lastTick: 0 }));
  const setMinutes = (mins) => {
    const ms = Math.max(1, Number(mins)) * 60 * 1000;
    setState({ duration: ms, remaining: ms, running: false, lastTick: 0 });
  };

  return (
    <Widget title="Focus Timer" className="h-[220px] overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="text-3xl font-mono">{format(state.remaining)}</div>
        <div className="flex items-center gap-2">
          {!state.running ? (
            <button onClick={start} className="px-3 py-1.5 text-xs rounded bg-emerald-600 hover:bg-emerald-500 text-white">
              Start
            </button>
          ) : (
            <button onClick={pause} className="px-3 py-1.5 text-xs rounded bg-yellow-600 hover:bg-yellow-500 text-white">
              Pause
            </button>
          )}
          <button onClick={reset} className="px-3 py-1.5 text-xs rounded bg-slate-700 hover:bg-slate-600 text-white">
            Reset
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span>Minutes:</span>
          <input
            type="number"
            min={1}
            max={180}
            className="w-16 bg-background border border-gray-700/60 rounded px-2 py-1 text-xs"
            value={Math.round(state.duration / 60000)}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </div>
      </div>
    </Widget>
  );
}

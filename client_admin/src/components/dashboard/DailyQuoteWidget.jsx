import React from "react";
import Widget from "../ui/Widget";
import api from "../../services/api";

const STORAGE_KEY = "tae.dailyBlessing.offset";

// Blessings are fetched from server based on day-of-year and optional offset

function formatDateLabel(offset) {
  if (offset === 0) return "Today";
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", weekday: "short" });
}

export default function DailyQuoteWidget() {
  const [offset, setOffset] = React.useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const n = raw != null ? parseInt(raw, 10) : 0;
      return Number.isFinite(n) && n >= 0 ? n : 0;
    } catch {
      return 0;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(offset));
    } catch {}
  }, [offset]);
  const [blessing, setBlessing] = React.useState({ name: "", description: "", volumeNumber: null });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isRandom, setIsRandom] = React.useState(false);

  React.useEffect(() => {
    let ignore = false;
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/public/daily-blessing`, { params: { offset } });
        const data = res.data?.data;
        if (!ignore && data) {
          setBlessing({
            name: data.name,
            description: data.description || "",
            volumeNumber: data.volumeNumber ?? null,
          });
          setIsRandom(false);
        }
      } catch (e) {
        if (!ignore) setError("Could not load blessing.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, [offset]);

  const prevDay = () => {
    setIsRandom(false);
    setOffset((o) => o + 1);
  };
  const nextRandom = async () => {
    // Fetch a random blessing without changing the offset/date label
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/public/random-blessing`);
      const data = res.data?.data;
      if (data) {
        setBlessing({
          name: data.name,
          description: data.description || "",
          volumeNumber: data.volumeNumber ?? null,
        });
        setIsRandom(true);
      }
    } catch (e) {
      setError("Could not load random blessing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Widget title="Daily Blessing" className="h-[220px] overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{isRandom ? "Random" : formatDateLabel(offset)}</span>
          {blessing.volumeNumber ? <span>Volume {blessing.volumeNumber}</span> : <span>&nbsp;</span>}
        </div>

        <div className="mt-2">
          <div className="text-sm font-semibold text-slate-100">
            {loading ? "Loading…" : error ? "Unavailable" : blessing.name}
          </div>
          <div className="mt-1 text-[12px] leading-relaxed text-slate-300 overflow-auto pr-1" style={{ maxHeight: 90 }}>
            {loading ? "" : error ? error : blessing.description}
          </div>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <button
            onClick={prevDay}
            className="px-2 py-1 text-[11px] rounded bg-slate-700 hover:bg-slate-600 text-white"
            title="View previous day"
          >
            Previous
          </button>
          <button
            onClick={nextRandom}
            disabled={loading}
            className="px-2 py-1 text-[11px] rounded bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
            title="Get a random blessing"
          >
            Next
          </button>
        </div>
      </div>
    </Widget>
  );
}

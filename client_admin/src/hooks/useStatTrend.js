import { useEffect, useMemo } from "react";

// Persist and compute simple trend for a stat key.
// Stores last N daily values in localStorage under `statTrend:<key>`.
export default function useStatTrend(key, value, options = {}) {
  const { horizon = 14, periodLabel = "yesterday" } = options;

  // Normalize today to YYYY-MM-DD
  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    if (key == null) return;
    try {
      const lsKey = `statTrend:${key}`;
      const existing = JSON.parse(localStorage.getItem(lsKey) || "[]");
      // Remove any duplicates for today, then push current
      const filtered = existing.filter((e) => e.date !== todayKey);
      filtered.push({ date: todayKey, value: Number(value) || 0 });
      // Keep only last N entries by date
      filtered.sort((a, b) => a.date.localeCompare(b.date));
      const trimmed = filtered.slice(-horizon);
      localStorage.setItem(lsKey, JSON.stringify(trimmed));
    } catch (e) {
      // noop
    }
  }, [key, value, todayKey, horizon]);

  const trend = useMemo(() => {
    try {
      const lsKey = `statTrend:${key}`;
      const arr = JSON.parse(localStorage.getItem(lsKey) || "[]");
      return arr.map((e) => Number(e.value) || 0);
    } catch (e) {
      return [];
    }
  }, [key, value, todayKey]);

  const changeInfo = useMemo(() => {
    if (!Array.isArray(trend) || trend.length < 2) {
      return { change: "±0", changeType: "increase", period: periodLabel };
    }
    const curr = trend[trend.length - 1];
    // prev is the last value before today
    const prev = trend[trend.length - 2];
    const diff = curr - prev;
    const changeType = diff >= 0 ? "increase" : "decrease";
    // Prefer % when previous is non-zero and values are not tiny
    let change;
    if (prev && Math.abs(prev) >= 1) {
      const pct = (diff / prev) * 100;
      const rounded = Math.abs(pct) >= 10 ? Math.round(pct) : Math.round(pct * 10) / 10;
      change = `${diff >= 0 ? "+" : ""}${rounded}%`;
    } else {
      change = `${diff >= 0 ? "+" : ""}${diff}`;
    }
    return { change, changeType, period: periodLabel };
  }, [trend, periodLabel]);

  return { trend, ...changeInfo };
}

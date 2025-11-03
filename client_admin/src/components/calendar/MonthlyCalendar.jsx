import { useMemo } from "react";

// Simple monthly grid calendar that accepts items [{date, title, color, type, amount}]
export default function MonthlyCalendar({ year, month, items = [] }) {
  // month is 1-12
  const firstDay = useMemo(() => new Date(year, month - 1, 1), [year, month]);
  const daysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
  const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Mon=0..Sun=6

  const grid = [];
  for (let i = 0; i < startDayOfWeek; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);

  const itemsByDay = useMemo(() => {
    const map = new Map();
    items.forEach((it) => {
      const dt = new Date(it.date);
      const day = dt.getDate();
      if (!map.has(day)) map.set(day, []);
      map.get(day).push(it);
    });
    return map;
  }, [items]);

  return (
    <div
      className="rounded-lg border shadow-sm"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-primary)" }}
    >
      <div
        className="grid grid-cols-7 text-center text-xs uppercase p-2"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="px-1 py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px p-2" style={{ backgroundColor: "var(--color-primary)", opacity: 0.3 }}>
        {grid.map((day, idx) => {
          const today = new Date();
          const isToday =
            day && today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === day;
          return (
            <div
              key={idx}
              className={`min-h-[90px] p-2 rounded ${isToday ? "bg-primary/20 ring-2 ring-primary/60" : ""}`}
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              {day && (
                <div>
                  <div
                    className={`text-right text-xs ${isToday ? "font-bold text-white" : ""}`}
                    style={{ color: isToday ? undefined : "var(--color-text-secondary)" }}
                  >
                    {day}
                  </div>
                  <div className="mt-1 space-y-1">
                    {(itemsByDay.get(day) || []).slice(0, 3).map((it, i) => (
                      <div
                        key={i}
                        className="px-1 py-0.5 rounded text-xs truncate"
                        style={{ backgroundColor: it.color || "#4b5563", color: "#fff" }}
                      >
                        {it.type === "bill" ? `${it.title} $${it.amount}` : it.title}
                      </div>
                    ))}
                    {(itemsByDay.get(day) || []).length > 3 && (
                      <div className="text-[10px] opacity-70" style={{ color: "var(--color-text-secondary)" }}>
                        +{(itemsByDay.get(day) || []).length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

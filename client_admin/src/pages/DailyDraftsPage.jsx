import { useEffect, useMemo, useState } from "react";
import Widget from "../components/ui/Widget";
import { Save, History, Trash2, CalendarDays } from "lucide-react";
import { listDates, getHistory, getLatest, saveDraft, deleteVersion, formatDate } from "../services/dailyDraftsService";

function toYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const DailyDraftsPage = () => {
  const [dateStr, setDateStr] = useState(() => toYMD(new Date()));
  const [content, setContent] = useState("");
  const [history, setHistory] = useState([]);
  const [allDates, setAllDates] = useState([]);

  const humanDate = useMemo(() => formatDate(dateStr), [dateStr]);

  const refresh = () => {
    setAllDates(listDates());
    setHistory(getHistory(dateStr));
    const latest = getLatest(dateStr);
    setContent(latest ? latest.content : "");
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateStr]);

  const handleSave = () => {
    if (!dateStr) return;
    saveDraft(dateStr, content || "");
    refresh();
  };

  const handleLoadVersion = (v) => {
    setContent(v.content || "");
  };

  const handleDeleteVersion = (v) => {
    if (!confirm("Delete this version?")) return;
    deleteVersion(dateStr, v.ts);
    refresh();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" /> Daily Drafts
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Editor */}
        <Widget title={`Draft for ${humanDate}`} className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-xs text-text-secondary">Date</label>
            <input
              type="date"
              className="rounded border px-2 py-1 text-xs bg-[var(--color-background)]"
              style={{ borderColor: "var(--color-primary)" }}
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
            />
            <div className="text-[11px] text-text-tertiary">Each day starts a new text entry and logs the date.</div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={18}
            className="w-full rounded border p-2 text-sm bg-[var(--color-background)] focus:outline-none"
            style={{ borderColor: "var(--color-primary)" }}
            placeholder="Draft today's events here..."
          />

          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded border text-xs bg-primary/20 hover:bg-primary/30"
              style={{ borderColor: "var(--color-primary)" }}
            >
              <Save className="w-4 h-4" /> Save New Version
            </button>
          </div>
        </Widget>

        {/* History */}
        <Widget title="History" className="lg:col-span-1">
          <div className="text-[11px] text-text-secondary mb-2 flex items-center gap-2">
            <History className="w-4 h-4 text-primary" /> {history.length} version(s)
          </div>
          {history.length === 0 ? (
            <div className="text-[12px] text-text-tertiary">No history for this date. Save a new version.</div>
          ) : (
            <ul className="space-y-2 max-h-[520px] overflow-auto pr-1">
              {history.map((v) => (
                <li key={v.ts} className="rounded border p-2 text-xs" style={{ borderColor: "var(--color-primary)" }}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-text-secondary">{new Date(v.ts).toLocaleString()}</div>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-2 py-0.5 rounded border text-[11px] hover:bg-primary/20"
                        style={{ borderColor: "var(--color-primary)" }}
                        onClick={() => handleLoadVersion(v)}
                      >
                        Load
                      </button>
                      <button
                        className="px-2 py-0.5 rounded border text-[11px] hover:bg-red-900/40 text-red-300"
                        style={{ borderColor: "var(--color-primary)" }}
                        onClick={() => handleDeleteVersion(v)}
                      >
                        <Trash2 className="inline-block w-3.5 h-3.5 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                  <pre className="mt-1 text-[11px] whitespace-pre-wrap break-words text-text-main max-h-24 overflow-auto">
                    {v.content}
                  </pre>
                </li>
              ))}
            </ul>
          )}

          {/* Other dates quick list */}
          <div className="mt-3">
            <div className="text-[11px] text-text-secondary mb-1">Other dates</div>
            {allDates.length === 0 ? (
              <div className="text-[12px] text-text-tertiary">No saved drafts yet.</div>
            ) : (
              <div className="flex flex-wrap gap-1">
                {allDates.map((d) => (
                  <button
                    key={d}
                    className={`px-2 py-0.5 rounded border text-[11px] hover:bg-primary/20 ${
                      d === dateStr ? "bg-primary/10" : ""
                    }`}
                    style={{ borderColor: "var(--color-primary)" }}
                    onClick={() => setDateStr(d)}
                    title={formatDate(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Widget>
      </div>
    </div>
  );
};

export default DailyDraftsPage;

import React from "react";
import Widget from "../ui/Widget";

const STORAGE_KEY = "tae.quickNotes";

export default function QuickNotesWidget() {
  const [notes, setNotes] = React.useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {}
  }, [notes]);

  const addNote = () => {
    const t = text.trim();
    if (!t) return;
    setNotes((prev) => [{ id: Date.now(), text: t }, ...prev]);
    setText("");
  };

  const removeNote = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));

  return (
    <Widget title="Quick Notes" className="h-[220px] overflow-hidden">
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
            placeholder="Jot something down…"
            className="flex-1 bg-background border border-gray-700/60 rounded px-2 py-1 text-xs"
          />
          <button onClick={addNote} className="px-2 py-1 text-xs rounded bg-primary text-white hover:opacity-90">
            Add
          </button>
        </div>
        <ul className="space-y-1 max-h-44 overflow-auto pr-1">
          {notes.length === 0 && <li className="text-text-secondary text-xs">No notes yet.</li>}
          {notes.map((n) => (
            <li
              key={n.id}
              className="flex items-start gap-2 bg-background/50 border border-gray-700/40 rounded px-2 py-1"
            >
              <span className="flex-1 whitespace-pre-wrap break-words text-xs">{n.text}</span>
              <button
                onClick={() => removeNote(n.id)}
                className="text-[10px] px-1 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white"
              >
                Del
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Widget>
  );
}

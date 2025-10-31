import React from "react";
import Widget from "../ui/Widget";

const STORAGE_KEY = "tae.quickLinks";

export default function QuickLinksWidget() {
  const [links, setLinks] = React.useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [title, setTitle] = React.useState("");
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    } catch {}
  }, [links]);

  const addLink = () => {
    const t = title.trim();
    const u = url.trim();
    if (!t || !u) return;
    setLinks((prev) => [{ id: Date.now(), title: t, url: u }, ...prev]);
    setTitle("");
    setUrl("");
  };

  const remove = (id) => setLinks((prev) => prev.filter((l) => l.id !== id));

  return (
    <Widget title="Quick Links" className="h-[220px] overflow-hidden">
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Label"
            className="col-span-1 bg-background border border-gray-700/60 rounded px-2 py-1 text-xs"
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="col-span-2 bg-background border border-gray-700/60 rounded px-2 py-1 text-xs"
          />
        </div>
        <div className="flex justify-end">
          <button onClick={addLink} className="px-2 py-1 text-xs rounded bg-primary text-white hover:opacity-90">
            Add Link
          </button>
        </div>
        <ul className="space-y-1 max-h-44 overflow-auto pr-1">
          {links.length === 0 && <li className="text-text-secondary text-xs">No links yet.</li>}
          {links.map((l) => (
            <li
              key={l.id}
              className="flex items-center gap-2 bg-background/50 border border-gray-700/40 rounded px-2 py-1"
            >
              <a
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-primary hover:underline text-xs truncate"
                title={l.url}
              >
                {l.title}
              </a>
              <button
                onClick={() => remove(l.id)}
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

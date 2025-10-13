import { useEffect, useState } from "react";

const BlessingsManager = ({ open, blessings = [], onClose, onApply }) => {
  const [local, setLocal] = useState([]);

  useEffect(() => {
    if (open)
      setLocal(
        Array.isArray(blessings) ? blessings.map((b) => ({ item: "", description: "", context: "", ...b })) : []
      );
  }, [open, blessings]);

  const updateField = (idx, field, value) => {
    const copy = [...local];
    copy[idx] = { ...copy[idx], [field]: value };
    setLocal(copy);
  };
  const addRow = () => setLocal([...(local || []), { item: "", description: "", context: "" }]);
  const removeRow = (idx) => setLocal(local.filter((_, i) => i !== idx));
  const move = (idx, dir) => {
    const next = idx + dir;
    if (next < 0 || next >= local.length) return;
    const arr = [...local];
    const [it] = arr.splice(idx, 1);
    arr.splice(next, 0, it);
    setLocal(arr);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-lg shadow-xl">
        <div className="p-3 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-white font-semibold">Blessings Manager</h3>
          <button className="text-gray-300 hover:text-white" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-auto space-y-3">
          {(local || []).map((b, i) => (
            <div key={i} className="p-3 rounded border border-gray-700 bg-gray-800/50">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-400">Blessing #{i + 1}</div>
                <div className="flex gap-2">
                  <button className="px-2 py-0.5 text-xs bg-gray-700 rounded" onClick={() => move(i, -1)}>
                    ↑
                  </button>
                  <button className="px-2 py-0.5 text-xs bg-gray-700 rounded" onClick={() => move(i, 1)}>
                    ↓
                  </button>
                  <button className="px-2 py-0.5 text-xs bg-red-700 rounded" onClick={() => removeRow(i)}>
                    Remove
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  className="p-2 bg-gray-900 rounded border border-gray-600 text-white"
                  placeholder="Blessing name"
                  value={b.item || ""}
                  onChange={(e) => updateField(i, "item", e.target.value)}
                />
                <input
                  className="md:col-span-2 p-2 bg-gray-900 rounded border border-gray-600 text-white"
                  placeholder="Blessing description"
                  value={b.description || ""}
                  onChange={(e) => updateField(i, "description", e.target.value)}
                />
                {/* Hidden/less prominent context field */}
                <textarea
                  className="md:col-span-3 p-2 bg-gray-900 rounded border border-gray-600 text-white text-xs"
                  placeholder="Optional general context for AI prompt (kept hidden in main UI)"
                  rows={2}
                  value={b.context || ""}
                  onChange={(e) => updateField(i, "context", e.target.value)}
                />
              </div>
            </div>
          ))}
          {(!local || local.length === 0) && (
            <div className="text-xs text-gray-400">No blessings yet. Click Add to begin.</div>
          )}
        </div>
        <div className="p-3 border-t border-gray-700 flex items-center justify-between">
          <button
            className="px-3 py-1.5 text-xs rounded bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white"
            onClick={addRow}
          >
            Add Blessing
          </button>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 text-xs rounded bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1.5 text-xs rounded bg-teal-700 hover:bg-teal-600 border border-teal-500 text-white"
              onClick={() => onApply(local)}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlessingsManager;

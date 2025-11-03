import React, { useMemo, useState } from "react";
import { useChartData } from "./ChartDataContext";
import { chartData as defaultChartData, systemStatus as defaultSystemStatus } from "./chartData";

function isNumberLike(v) {
  return v !== "" && v !== null && !Number.isNaN(Number(v));
}

export default function ChartEditorModal({ isOpen, onClose, initialTab = "coherence" }) {
  const {
    coherenceSeries,
    setCoherenceSeries,
    anomalySeries,
    setAnomalySeries,
    driftSeries,
    setDriftSeries,
    systemStatus,
    setSystemStatus,
  } = useChartData();
  const [activeTab, setActiveTab] = useState("coherence");

  const [coherenceDraft, setCoherenceDraft] = useState(() => coherenceSeries);
  const [anomalyDraft, setAnomalyDraft] = useState(() => anomalySeries);
  const [driftDraft, setDriftDraft] = useState(() => driftSeries);
  const [statusDraft, setStatusDraft] = useState(() => systemStatus);

  // Reset drafts each time opening
  React.useEffect(() => {
    if (isOpen) {
      setCoherenceDraft(coherenceSeries);
      setAnomalyDraft(anomalySeries);
      setDriftDraft(driftSeries);
      setStatusDraft(systemStatus);
      setActiveTab(initialTab || "coherence");
    }
  }, [isOpen, coherenceSeries, anomalySeries, driftSeries, systemStatus, initialTab]);

  const totalStatus = useMemo(() => statusDraft.reduce((sum, s) => sum + (Number(s.value) || 0), 0), [statusDraft]);

  // Shared helpers for series drafts
  const addRow = (setter, list) => {
    const idx = list.length;
    const newRow = { name: `T+${idx}h`, value: 0 };
    setter((prev) => [...prev, newRow]);
  };

  const removeRow = (setter, i) => {
    setter((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateRow = (setter, i, field, value) => {
    setter((prev) =>
      prev.map((row, idx) => (idx === i ? { ...row, [field]: field === "name" ? value : Number(value) } : row))
    );
  };

  const addStatusRow = () => {
    setStatusDraft((prev) => [...prev, { name: "New", value: 0, color: "#8884d8" }]);
  };

  const removeStatusRow = (i) => {
    setStatusDraft((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateStatusRow = (i, field, value) => {
    setStatusDraft((prev) =>
      prev.map((row, idx) => (idx === i ? { ...row, [field]: field === "value" ? Number(value) : value } : row))
    );
  };

  const handleSave = () => {
    // Basic validation
    const validateSeries = (series, label) => {
      const unique = new Set();
      for (const r of series) {
        if (!r.name || unique.has(r.name)) {
          alert(`${label}: each row must have a unique, non-empty name.`);
          return false;
        }
        if (!isNumberLike(r.value)) {
          alert(`${label}: value must be a number.`);
          return false;
        }
        unique.add(r.name);
      }
      return true;
    };

    if (
      !validateSeries(coherenceDraft, "Coherence") ||
      !validateSeries(anomalyDraft, "Anomaly") ||
      !validateSeries(driftDraft, "Drift")
    ) {
      return;
    }

    if (statusDraft.length === 0) {
      alert("System Status must have at least one slice.");
      return;
    }
    for (const s of statusDraft) {
      if (!s.name) {
        alert("System Status: each slice must have a name.");
        return;
      }
      if (!isNumberLike(s.value)) {
        alert("System Status: values must be numbers.");
        return;
      }
      if (!s.color) {
        alert("System Status: each slice must have a color.");
        return;
      }
    }

    setCoherenceSeries(coherenceDraft);
    setAnomalySeries(anomalyDraft);
    setDriftSeries(driftDraft);
    setSystemStatus(statusDraft);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 text-slate-100 rounded-lg shadow-xl w-[90vw] max-w-5xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <h3 className="text-lg font-semibold">Edit Charts</h3>
          <button onClick={onClose} className="px-2 py-1 text-sm rounded hover:bg-slate-800">
            Close
          </button>
        </div>

        <div className="px-4 pt-3">
          <div className="inline-flex rounded border border-slate-700 overflow-hidden">
            <button
              className={`px-3 py-1.5 text-sm ${activeTab === "coherence" ? "bg-slate-800" : "bg-slate-900"}`}
              onClick={() => setActiveTab("coherence")}
            >
              Coherence
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${activeTab === "anomaly" ? "bg-slate-800" : "bg-slate-900"}`}
              onClick={() => setActiveTab("anomaly")}
            >
              Anomaly
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${activeTab === "drift" ? "bg-slate-800" : "bg-slate-900"}`}
              onClick={() => setActiveTab("drift")}
            >
              Drift
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${activeTab === "status" ? "bg-slate-800" : "bg-slate-900"}`}
              onClick={() => setActiveTab("status")}
            >
              System Status
            </button>
          </div>
        </div>

        <div className="p-4 overflow-auto">
          {activeTab === "coherence" ? (
            <SeriesEditor
              title="Coherence"
              rows={coherenceDraft}
              onAdd={() => addRow(setCoherenceDraft, coherenceDraft)}
              onRemove={(i) => removeRow(setCoherenceDraft, i)}
              onUpdate={(i, field, value) => updateRow(setCoherenceDraft, i, field, value)}
            />
          ) : activeTab === "anomaly" ? (
            <SeriesEditor
              title="Anomaly"
              rows={anomalyDraft}
              onAdd={() => addRow(setAnomalyDraft, anomalyDraft)}
              onRemove={(i) => removeRow(setAnomalyDraft, i)}
              onUpdate={(i, field, value) => updateRow(setAnomalyDraft, i, field, value)}
            />
          ) : activeTab === "drift" ? (
            <SeriesEditor
              title="Drift"
              rows={driftDraft}
              onAdd={() => addRow(setDriftDraft, driftDraft)}
              onRemove={(i) => removeRow(setDriftDraft, i)}
              onUpdate={(i, field, value) => updateRow(setDriftDraft, i, field, value)}
            />
          ) : (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">System Status Slices</h4>
                <button onClick={addStatusRow} className="px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-500">
                  Add Slice
                </button>
              </div>
              <div className="overflow-auto border border-slate-700 rounded">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="text-left px-2 py-1">Name</th>
                      <th className="text-left px-2 py-1">Value</th>
                      <th className="text-left px-2 py-1">Color</th>
                      <th className="px-2 py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {statusDraft.map((row, i) => (
                      <tr key={i} className="odd:bg-slate-900/40">
                        <td className="px-2 py-1">
                          <input
                            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 w-40"
                            value={row.name}
                            onChange={(e) => updateStatusRow(i, "name", e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            step="1"
                            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 w-28"
                            value={row.value}
                            onChange={(e) => updateStatusRow(i, "value", e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              className="bg-slate-800 border border-slate-700 rounded w-10 h-8 p-0"
                              value={row.color}
                              onChange={(e) => updateStatusRow(i, "color", e.target.value)}
                              title={row.color}
                            />
                            <input
                              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 w-40"
                              value={row.color}
                              onChange={(e) => updateStatusRow(i, "color", e.target.value)}
                            />
                          </div>
                        </td>
                        <td className="px-2 py-1 text-right">
                          <button
                            onClick={() => removeStatusRow(i)}
                            className="px-2 py-1 text-xs rounded bg-red-600 hover:bg-red-500"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-xs mt-2 text-slate-400">Total value: {totalStatus}</div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-slate-700 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              const toSeries = (key) => defaultChartData.map((d) => ({ name: d.name, value: d[key] }));
              setCoherenceDraft(toSeries("coherence"));
              setAnomalyDraft(toSeries("anomaly"));
              setDriftDraft(toSeries("drift"));
              setStatusDraft(defaultSystemStatus);
            }}
            className="px-3 py-1.5 text-sm rounded bg-slate-800 hover:bg-slate-700"
            title="Reset editor values to built-in defaults"
          >
            Reset to defaults
          </button>
          <button onClick={onClose} className="px-3 py-1.5 text-sm rounded bg-slate-800 hover:bg-slate-700">
            Cancel
          </button>
          <button onClick={handleSave} className="px-3 py-1.5 text-sm rounded bg-green-600 hover:bg-green-500">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function SeriesEditor({ title, rows, onAdd, onRemove, onUpdate }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{title} Series</h4>
        <button onClick={onAdd} className="px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-500">
          Add Row
        </button>
      </div>
      <div className="overflow-auto border border-slate-700 rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800">
            <tr>
              <th className="text-left px-2 py-1">Name</th>
              <th className="text-left px-2 py-1">Value</th>
              <th className="px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="odd:bg-slate-900/40">
                <td className="px-2 py-1">
                  <input
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 w-40"
                    value={row.name}
                    onChange={(e) => onUpdate(i, "name", e.target.value)}
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    step="0.01"
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 w-28"
                    value={row.value}
                    onChange={(e) => onUpdate(i, "value", e.target.value)}
                  />
                </td>
                <td className="px-2 py-1 text-right">
                  <button onClick={() => onRemove(i)} className="px-2 py-1 text-xs rounded bg-red-600 hover:bg-red-500">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

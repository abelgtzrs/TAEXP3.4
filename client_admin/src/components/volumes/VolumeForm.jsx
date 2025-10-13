import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { parseRawGreentext } from "../../utils/greentextParser";
import { listBlessingDefs } from "../../services/blessingsService";

// The component now receives formData and a handler to change it.
const VolumeForm = ({ formData, onFormChange, onSubmit, loading, submitButtonText = "Submit" }) => {
  // The JSON preview state can still live here, as it's purely for display.
  const [parsedPreview, setParsedPreview] = useState({});

  // This effect updates the JSON preview whenever the raw text changes.
  useEffect(() => {
    const handler = setTimeout(() => {
      // We now get the raw text from the formData prop.
      setParsedPreview(parseRawGreentext(formData.rawPastedText || ""));
    }, 300); // Shortened delay for a snappier preview

    return () => clearTimeout(handler);
  }, [formData.rawPastedText]);

  // Update scalar field helper
  const handleChange = (e) => {
    onFormChange({ ...formData, [e.target.name]: e.target.value });
  };

  // Inline blessings editor helpers
  const blessings = Array.isArray(formData.blessings) ? formData.blessings : [];
  const updateBlessing = (idx, field, value) => {
    const next = [...blessings];
    next[idx] = { item: "", description: "", context: "", ...next[idx], [field]: value };
    onFormChange({ ...formData, blessings: next });
  };
  const addBlessing = () => {
    onFormChange({
      ...formData,
      blessings: [...blessings, { item: "", description: "", context: "" }],
    });
  };
  const removeBlessing = (idx) => {
    const next = blessings.filter((_, i) => i !== idx);
    onFormChange({ ...formData, blessings: next });
  };
  const moveBlessing = (idx, dir) => {
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= blessings.length) return;
    const arr = [...blessings];
    const [it] = arr.splice(idx, 1);
    arr.splice(nextIdx, 0, it);
    onFormChange({ ...formData, blessings: arr });
  };

  // Master blessings: fetch and compute which are missing on this volume
  const [masterBlessings, setMasterBlessings] = useState([]);
  const [masterError, setMasterError] = useState("");
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const defs = await listBlessingDefs();
        if (mounted) setMasterBlessings(Array.isArray(defs) ? defs : []);
      } catch (e) {
        if (mounted) setMasterError("Failed to load master blessings");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const presentNameSet = new Set(blessings.map((b) => (b?.item || "").trim().toLowerCase()).filter(Boolean));
  const missingFromMaster = (masterBlessings || [])
    .filter((m) => m?.active !== false)
    .filter(
      (m) =>
        !presentNameSet.has(
          String(m?.name || "")
            .trim()
            .toLowerCase()
        )
    );

  const addFromMaster = (m) => {
    const item = String(m?.name || "");
    if (!item) return;
    if (presentNameSet.has(item.trim().toLowerCase())) return; // guard against race duplicates
    const next = [...blessings, { item, description: m?.defaultDescription || "", context: m?.context || "" }];
    onFormChange({ ...formData, blessings: next });
  };
  const addAllMissingFromMaster = () => {
    if (!missingFromMaster.length) return;
    const next = [...blessings];
    const currentSet = new Set(presentNameSet);
    missingFromMaster.forEach((m) => {
      const name = String(m?.name || "").trim();
      if (!name) return;
      const key = name.toLowerCase();
      if (currentSet.has(key)) return;
      currentSet.add(key);
      next.push({ item: name, description: m?.defaultDescription || "", context: m?.context || "" });
    });
    onFormChange({ ...formData, blessings: next });
  };

  // Apply parsed data from raw text into structured fields
  const applyParsedToFields = () => {
    const parsed = parseRawGreentext(formData.rawPastedText || "");
    onFormChange({
      ...formData,
      volumeNumber: parsed.volumeNumber ?? "",
      title: parsed.title ?? "",
      bodyText: (parsed.bodyLines || []).join("\n"),
      blessingIntro: parsed.blessingIntro ?? "",
      blessings: parsed.blessings || [],
      dream: parsed.dream ?? "",
      edition: parsed.edition ?? "",
    });
  };

  return (
    <form onSubmit={onSubmit} className="mb-8 p-6" style={{ color: "var(--color-text-main)" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="rawPastedText" className="block text-sm font-medium text-text-secondary mb-2">
            Raw Greentext Content
          </label>
          <textarea
            id="rawPastedText"
            name="rawPastedText" // Added name attribute for the handler
            value={formData.rawPastedText || ""} // Controlled by parent's state
            onChange={handleChange}
            required
            className="w-full h-[450px] p-3 rounded font-mono text-sm focus:outline-none"
            style={{
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-primary)",
              color: "var(--color-text-main)",
            }}
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={applyParsedToFields}
              className="px-3 py-1.5 text-xs rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-main"
            >
              Apply Parsed Fields
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Live JSON Preview</label>
          <pre
            className="w-full h-[450px] p-3 rounded text-xs overflow-auto"
            style={{
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-primary)",
              color: "var(--color-text-secondary)",
            }}
          >
            {JSON.stringify(parsedPreview, null, 2)}
          </pre>
        </div>
      </div>

      {/* Structured Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Volume Number</label>
            <input
              type="number"
              name="volumeNumber"
              value={formData.volumeNumber || ""}
              onChange={handleChange}
              className="w-full p-2 rounded"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              className="w-full p-2 rounded"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Blessing Intro (Life Is…)</label>
            <input
              type="text"
              name="blessingIntro"
              value={formData.blessingIntro || ""}
              onChange={handleChange}
              className="w-full p-2 rounded"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">Body</label>
          <textarea
            name="bodyText"
            value={formData.bodyText || ""}
            onChange={handleChange}
            rows={10}
            className="w-full p-2 rounded font-mono text-sm"
            style={{
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-primary)",
              color: "var(--color-text-main)",
            }}
          />
        </div>
      </div>

      {/* Inline Blessings Editor */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-text-secondary">
            Blessings (per-volume)
            {missingFromMaster?.length > 0 && (
              <span className="ml-2 text-[10px] text-amber-300">{missingFromMaster.length} missing from master</span>
            )}
          </label>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/blessings"
              target="_blank"
              className="px-3 py-1 text-xs rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-main"
            >
              Manage master blessings
            </Link>
            <button
              type="button"
              onClick={addBlessing}
              className="px-3 py-1 text-xs rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-main"
            >
              Add Blessing
            </button>
          </div>
        </div>
        {/* Missing master blessings panel */}
        {(missingFromMaster?.length > 0 || masterError) && (
          <div className="mb-3 p-2 rounded border border-amber-600 bg-amber-900/20">
            <div className="flex items-center justify-between">
              <div className="text-xs text-amber-200">
                {masterError ? (
                  <span>{masterError}</span>
                ) : (
                  <span>
                    Missing from library: <strong>{missingFromMaster.length}</strong>
                  </span>
                )}
              </div>
              {!masterError && (
                <button
                  type="button"
                  onClick={addAllMissingFromMaster}
                  className="px-2 py-0.5 text-[11px] rounded bg-amber-700 hover:bg-amber-600 border border-amber-500 text-white"
                >
                  Add all
                </button>
              )}
            </div>
            {!masterError && (
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                {missingFromMaster.map((m) => (
                  <div
                    key={m._id}
                    className="flex items-center justify-between text-[11px] rounded px-2 py-1"
                    style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-primary)" }}
                  >
                    <span className="truncate mr-2">{m.name}</span>
                    <button
                      type="button"
                      onClick={() => addFromMaster(m)}
                      className="px-2 py-0.5 text-[10px] rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-main"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
          {blessings.length === 0 && (
            <div className="text-xs text-text-secondary opacity-70">No blessings yet. Click Add Blessing to start.</div>
          )}
          {blessings.map((b, i) => (
            <div
              key={i}
              className="p-3 rounded"
              style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-primary)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-text-secondary">Blessing #{i + 1}</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-0.5 text-xs rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-main"
                    onClick={() => moveBlessing(i, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="px-2 py-0.5 text-xs rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-main"
                    onClick={() => moveBlessing(i, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="px-2 py-0.5 text-xs bg-red-700 rounded"
                    onClick={() => removeBlessing(i)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  className="p-2 rounded"
                  style={{
                    backgroundColor: "var(--color-bg)",
                    border: "1px solid var(--color-primary)",
                    color: "var(--color-text-main)",
                  }}
                  placeholder="Blessing name"
                  value={b.item || ""}
                  onChange={(e) => updateBlessing(i, "item", e.target.value)}
                />
                <input
                  className="md:col-span-2 p-2 rounded"
                  style={{
                    backgroundColor: "var(--color-bg)",
                    border: "1px solid var(--color-primary)",
                    color: "var(--color-text-main)",
                  }}
                  placeholder="Blessing description (this volume)"
                  value={b.description || ""}
                  onChange={(e) => updateBlessing(i, "description", e.target.value)}
                />
                <details className="md:col-span-3">
                  <summary className="text-[11px] text-text-secondary cursor-pointer">
                    Optional AI context (advanced)
                  </summary>
                  <textarea
                    className="mt-2 w-full p-2 rounded text-xs"
                    style={{
                      backgroundColor: "var(--color-bg)",
                      border: "1px solid var(--color-primary)",
                      color: "var(--color-text-main)",
                    }}
                    placeholder="General guidance to preserve lore; typically managed globally."
                    rows={2}
                    value={b.context || ""}
                    onChange={(e) => updateBlessing(i, "context", e.target.value)}
                  />
                </details>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dream */}
      <div className="mt-6">
        <label className="block text-sm text-text-secondary mb-1">Dream</label>
        <textarea
          name="dream"
          value={formData.dream || ""}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 rounded"
          style={{
            backgroundColor: "var(--color-bg)",
            border: "1px solid var(--color-primary)",
            color: "var(--color-text-main)",
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          <label htmlFor="status" className="mr-2 text-text-secondary">
            Status:
          </label>
          <select
            id="status"
            name="status" // Added name attribute
            value={formData.status || "draft"} // Controlled by parent's state
            onChange={handleChange}
            className="p-2 rounded focus:outline-none"
            style={{
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-primary)",
              color: "var(--color-text-main)",
            }}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="py-3 px-6 rounded-lg transition duration-300 border"
          style={{
            backgroundColor: "var(--color-primary)",
            borderColor: "var(--color-primary)",
            color: "var(--color-text-on-primary)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Saving..." : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default VolumeForm;

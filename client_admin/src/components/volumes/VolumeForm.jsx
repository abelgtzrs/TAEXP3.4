import { useState, useEffect } from "react";
import { parseRawGreentext } from "../../utils/greentextParser";

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

  // Blessings handlers
  const handleBlessingChange = (index, field, value) => {
    const list = Array.isArray(formData.blessings) ? [...formData.blessings] : [];
    if (!list[index]) list[index] = { item: "", description: "" };
    list[index] = { ...list[index], [field]: value };
    onFormChange({ ...formData, blessings: list });
  };
  const addBlessingRow = () => {
    const list = Array.isArray(formData.blessings) ? [...formData.blessings] : [];
    list.push({ item: "", description: "" });
    onFormChange({ ...formData, blessings: list });
  };
  const removeBlessingRow = (index) => {
    const list = Array.isArray(formData.blessings) ? [...formData.blessings] : [];
    onFormChange({ ...formData, blessings: list.filter((_, i) => i !== index) });
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
    <form onSubmit={onSubmit} className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="rawPastedText" className="block text-sm font-medium text-gray-300 mb-2">
            Raw Greentext Content
          </label>
          <textarea
            id="rawPastedText"
            name="rawPastedText" // Added name attribute for the handler
            value={formData.rawPastedText || ""} // Controlled by parent's state
            onChange={handleChange}
            required
            className="w-full h-[450px] p-3 bg-gray-900 rounded border border-gray-600 text-white font-mono text-sm focus:outline-none focus:border-teal-500"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={applyParsedToFields}
              className="px-3 py-1.5 text-xs rounded bg-teal-700 hover:bg-teal-600 border border-teal-500 text-white"
            >
              Apply Parsed Fields
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Live JSON Preview</label>
          <pre className="w-full h-[450px] p-3 bg-gray-900 rounded border border-gray-600 text-sky-300 text-xs overflow-auto">
            {JSON.stringify(parsedPreview, null, 2)}
          </pre>
        </div>
      </div>

      {/* Structured Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Volume Number</label>
            <input
              type="number"
              name="volumeNumber"
              value={formData.volumeNumber || ""}
              onChange={handleChange}
              className="w-full p-2 bg-gray-900 rounded border border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              className="w-full p-2 bg-gray-900 rounded border border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Blessing Intro (Life Is…)</label>
            <input
              type="text"
              name="blessingIntro"
              value={formData.blessingIntro || ""}
              onChange={handleChange}
              className="w-full p-2 bg-gray-900 rounded border border-gray-600 text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Body</label>
          <textarea
            name="bodyText"
            value={formData.bodyText || ""}
            onChange={handleChange}
            rows={10}
            className="w-full p-2 bg-gray-900 rounded border border-gray-600 text-white font-mono text-sm"
          />
        </div>
      </div>

      {/* Blessings Editor */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-300">Blessings</label>
          <button
            type="button"
            onClick={addBlessingRow}
            className="px-3 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white"
          >
            Add Blessing
          </button>
        </div>
        <div className="space-y-2">
          {(formData.blessings || []).map((b, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
              <input
                type="text"
                placeholder="Blessing name"
                value={b.item || ""}
                onChange={(e) => handleBlessingChange(i, "item", e.target.value)}
                className="p-2 bg-gray-900 rounded border border-gray-600 text-white"
              />
              <input
                type="text"
                placeholder="Blessing description"
                value={b.description || ""}
                onChange={(e) => handleBlessingChange(i, "description", e.target.value)}
                className="md:col-span-2 p-2 bg-gray-900 rounded border border-gray-600 text-white"
              />
              <div className="md:col-span-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeBlessingRow(i)}
                  className="px-2 py-1 text-xs rounded bg-red-700 hover:bg-red-600 border border-red-600 text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {(!formData.blessings || formData.blessings.length === 0) && (
            <div className="text-xs text-gray-500">No blessings added yet.</div>
          )}
        </div>
      </div>

      {/* Dream */}
      <div className="mt-6">
        <label className="block text-sm text-gray-300 mb-1">Dream</label>
        <textarea
          name="dream"
          value={formData.dream || ""}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 bg-gray-900 rounded border border-gray-600 text-white"
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          <label htmlFor="status" className="mr-2 text-gray-300">
            Status:
          </label>
          <select
            id="status"
            name="status" // Added name attribute
            value={formData.status || "draft"} // Controlled by parent's state
            onChange={handleChange}
            className="p-2 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-secondary hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-500"
        >
          {loading ? "Saving..." : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default VolumeForm;

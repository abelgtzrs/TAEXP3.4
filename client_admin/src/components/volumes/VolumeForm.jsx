// src/components/volumes/VolumeForm.jsx
import { useState, useEffect } from "react";
import { parseRawGreentext } from "../../utils/greentextParser";

// The component now accepts props for initial data, a submit handler, and button text.
const VolumeForm = ({
  initialData = {},
  onSubmit,
  loading,
  submitButtonText = "Submit",
}) => {
  // State for the form inputs
  const [rawPastedText, setRawPastedText] = useState("");
  const [status, setStatus] = useState("draft");

  // New state for the live JSON preview
  const [parsedPreview, setParsedPreview] = useState({});

  // This useEffect hook populates the form when initialData is provided (for editing).
  useEffect(() => {
    if (initialData) {
      setRawPastedText(initialData.rawPastedText || "");
      setStatus(initialData.status || "draft");
    }
  }, [initialData]); // This effect runs whenever the initialData prop changes.

  // This useEffect hook handles the live preview, just like before.
  useEffect(() => {
    const handler = setTimeout(() => {
      setParsedPreview(parseRawGreentext(rawPastedText));
    }, 500);

    return () => clearTimeout(handler);
  }, [rawPastedText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rawPastedText.trim()) return;
    // Call the onSubmit function passed down from the parent page.
    onSubmit({ rawPastedText, status });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg"
    >
      {/* The rest of the form is mostly the same... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="rawText"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Raw Greentext Content
          </label>
          <textarea
            id="rawText"
            value={rawPastedText}
            onChange={(e) => setRawPastedText(e.target.value)}
            required
            className="w-full h-[450px] p-3 bg-gray-900 rounded border border-gray-600 text-white font-mono text-sm focus:outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Live JSON Preview
          </label>
          <pre className="w-full h-[450px] p-3 bg-gray-900 rounded border border-gray-600 text-sky-300 text-xs overflow-auto">
            {JSON.stringify(parsedPreview, null, 2)}
          </pre>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          <label htmlFor="status" className="mr-2 text-gray-300">
            Status:
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-500"
        >
          {loading ? "Saving..." : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default VolumeForm;

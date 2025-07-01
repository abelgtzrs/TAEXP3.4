import { useState, useEffect } from "react";
import { parseRawGreentext } from "../../utils/greentextParser";

// The component now receives formData and a handler to change it.
const VolumeForm = ({
  formData,
  onFormChange,
  onSubmit,
  loading,
  submitButtonText = "Submit",
}) => {
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

  // This is a local handler that calls the onFormChange function from the parent.
  const handleChange = (e) => {
    onFormChange({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="rawPastedText"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
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
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-500"
        >
          {loading ? "Saving..." : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default VolumeForm;

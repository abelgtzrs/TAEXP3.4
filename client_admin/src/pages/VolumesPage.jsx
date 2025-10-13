import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../services/api";
import VolumeForm from "../components/volumes/VolumeForm"; // Import the refactored form
import { buildExportText, copyToClipboard, downloadTxt } from "./volumeFunctionality/exportHelpers";
import { toFormData, toPayload } from "./volumeFunctionality/formMappers";
import {
  fetchVolumes as fetchAllVolumes,
  createVolume,
  updateVolume,
  deleteVolume as removeVolume,
} from "./volumeFunctionality/volumeApi";

// This is the starting state for a new, blank form.
const INITIAL_FORM_STATE = {
  rawPastedText: "",
  status: "draft",
  // Structured fields for explicit editing
  volumeNumber: "",
  title: "",
  bodyText: "", // UI representation; convert to bodyLines[] on submit
  blessingIntro: "",
  blessings: [], // [{ item, description }]
  dream: "",
  edition: "",
};

const VolumesPage = () => {
  // --- STATE MANAGEMENT ---
  const [volumes, setVolumes] = useState([]); // For the list of all volumes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Export modal state
  const [exportOpen, setExportOpen] = useState(false);
  const [exportText, setExportText] = useState("");

  // NEW: The form's data now lives here in the parent component.
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  // NEW: We still track the form's submission loading state separately.
  const [formLoading, setFormLoading] = useState(false);
  // NEW: Track if we are editing or creating.
  const [editingId, setEditingId] = useState(null);

  // --- DATA FETCHING ---
  const fetchVolumes = async () => {
    try {
      setLoading(true);
      const data = await fetchAllVolumes();
      setVolumes(data);
    } catch (err) {
      setError("Failed to fetch volumes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolumes();
  }, []);

  // --- EXPORT HELPERS ---
  // buildExportText moved to exportHelpers

  const openExportModal = () => {
    const published = (volumes || []).filter((v) => v.status === "published");
    const txt = buildExportText(published);
    setExportText(txt);
    setExportOpen(true);
  };

  const copyExportToClipboard = async () => {
    const ok = await copyToClipboard(exportText);
    alert(ok ? "Export copied to clipboard." : "Failed to copy. Please select the text and copy manually.");
  };

  const downloadExportTxt = () => downloadTxt(exportText, "volumes-export");

  // --- FORM & ACTION HANDLERS ---

  // This function is passed down to the form to update this page's state.
  const handleFormChange = (newFormData) => {
    setFormData(newFormData);
  };

  // Populates the form when an "Edit" button is clicked.
  const handleEditClick = (volume) => {
    setEditingId(volume._id);
    setFormData(toFormData(volume));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clears the form and resets it to "Create" mode.
  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setEditingId(null);
  };

  // Handles form submission for both creating and updating.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    try {
      // Build payload from structured fields; convert bodyText -> bodyLines
      const finalPayload = toPayload(formData);

      if (editingId) {
        // If we are editing, send a PUT request.
        await updateVolume(editingId, finalPayload);
      } else {
        // Otherwise, send a POST request to create.
        await createVolume(finalPayload);
      }
      resetForm(); // Reset the form fields after success
      await fetchVolumes(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while saving.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteVolume = async (volumeId) => {
    if (window.confirm("Are you sure you want to permanently delete this volume?")) {
      try {
        await removeVolume(volumeId);
        await fetchVolumes();
      } catch (err) {
        setError("Failed to delete volume.");
      }
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-6 w-full">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold text-main"
          >
            Greentext Volume Manager
          </motion.h1>
        </div>

        {/* --- The Form Section --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex justify-between items-center">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-xl text-main font-semibold mb-4"
            >
              {editingId ? "Edit Volume" : "Create New Volume"}
            </motion.h2>
            {editingId && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                onClick={resetForm}
                className="text-sm text-main hover:text-primary mb-4"
              >
                Cancel Edit
              </motion.button>
            )}
          </div>
          <VolumeForm
            formData={formData}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
            loading={formLoading}
            submitButtonText={editingId ? "Update Volume" : "Create Volume"}
          />
        </motion.div>

        {/* --- The List Section --- */}
        <div className="flex items-center justify-between mt-10 mb-4">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-2xl font-semibold text-white"
          >
            Existing Volumes
          </motion.h2>
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            whileTap={{ scale: 0.98 }}
            onClick={openExportModal}
            className="ml-auto px-3 py-2 rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-sm"
            title="Export all published volumes to raw text"
          >
            Export Published (TXT)
          </motion.button>
        </div>

        {loading && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Loading...
          </motion.p>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-red-500"
          >
            {error}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-gray-800 rounded-lg overflow-hidden"
        >
          <table className="min-w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-900 text-xs uppercase">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Title</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volumes.map((vol, index) => (
                <motion.tr
                  key={vol._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                  whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)", transition: { duration: 0.2 } }}
                  className="border-b border-gray-700"
                >
                  <td className="p-3 font-bold">{vol.volumeNumber}</td>
                  <td className="p-3">{vol.title}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        vol.status === "published"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {vol.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(vol.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 space-x-4">
                    {/* The Edit button now just populates the form on this page */}
                    <motion.button
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditClick(vol)}
                      className="font-medium text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteVolume(vol._id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>

      {/* Export Modal */}
      {exportOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setExportOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-lg max-w-5xl w-full max-h-[80vh] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Published Volumes — Raw Text Export</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyExportToClipboard}
                  className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 border border-gray-600 text-sm"
                >
                  Copy
                </button>
                <button
                  onClick={downloadExportTxt}
                  className="px-3 py-1.5 rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary text-sm"
                >
                  Download .txt
                </button>
                <button
                  onClick={() => setExportOpen(false)}
                  className="px-3 py-1.5 rounded bg-red-900/40 hover:bg-red-900/60 border border-red-800 text-red-200 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="p-3">
              <textarea
                readOnly
                value={exportText}
                className="w-full h-[60vh] bg-black/60 text-gray-100 font-mono text-xs p-3 rounded resize-none"
                spellCheck={false}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default VolumesPage;

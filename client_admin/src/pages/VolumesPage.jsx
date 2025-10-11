import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../services/api";
import VolumeForm from "../components/volumes/VolumeForm"; // Import the refactored form

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
      const response = await api.get("/admin/volumes");
      setVolumes(response.data.data);
    } catch (err) {
      setError("Failed to fetch volumes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolumes();
  }, []);

  // --- FORM & ACTION HANDLERS ---

  // This function is passed down to the form to update this page's state.
  const handleFormChange = (newFormData) => {
    setFormData(newFormData);
  };

  // Populates the form when an "Edit" button is clicked.
  const handleEditClick = (volume) => {
    setEditingId(volume._id);
    setFormData({
      rawPastedText: volume.rawPastedText || "",
      status: volume.status || "draft",
      volumeNumber: volume.volumeNumber ?? "",
      title: volume.title ?? "",
      bodyText: Array.isArray(volume.bodyLines) ? volume.bodyLines.join("\n") : "",
      blessingIntro: volume.blessingIntro ?? "",
      blessings: Array.isArray(volume.blessings) ? volume.blessings : [],
      dream: volume.dream ?? "",
      edition: volume.edition ?? "",
    });
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
      const finalPayload = {
        rawPastedText: formData.rawPastedText,
        status: formData.status,
        volumeNumber: formData.volumeNumber === "" ? null : Number(formData.volumeNumber),
        title: formData.title,
        bodyLines: (formData.bodyText || "")
          .split(/\r?\n/)
          .map((l) => l.trimEnd())
          .filter((l, idx, arr) => true),
        blessingIntro: formData.blessingIntro,
        blessings: Array.isArray(formData.blessings) ? formData.blessings : [],
        dream: formData.dream,
        edition: formData.edition,
      };

      if (editingId) {
        // If we are editing, send a PUT request.
        await api.put(`/admin/volumes/${editingId}`, finalPayload);
      } else {
        // Otherwise, send a POST request to create.
        await api.post("/admin/volumes", finalPayload);
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
        await api.delete(`/admin/volumes/${volumeId}`);
        await fetchVolumes();
      } catch (err) {
        setError("Failed to delete volume.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-bold text-main mb-6"
      >
        Greentext Volume Manager
      </motion.h1>

      {/* --- The Form Section --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.005, transition: { duration: 0.2 } }}
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
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
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
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-2xl font-semibold text-white mt-10 mb-4"
      >
        Existing Volumes
      </motion.h2>

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
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
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
                      vol.status === "published" ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"
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
  );
};

export default VolumesPage;

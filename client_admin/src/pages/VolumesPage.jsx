import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import VolumeForm from "../components/volumes/VolumeForm"; // Import the refactored form

// This is the starting state for a new, blank form.
const INITIAL_FORM_STATE = {
  rawPastedText: "",
  status: "draft",
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
      rawPastedText: volume.rawPastedText,
      status: volume.status,
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
      if (editingId) {
        // If we are editing, send a PUT request.
        await api.put(`/admin/volumes/${editingId}`, formData);
      } else {
        // Otherwise, send a POST request to create.
        await api.post("/admin/volumes", formData);
      }
      resetForm(); // Reset the form fields after success
      await fetchVolumes(); // Refresh the list
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while saving."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteVolume = async (volumeId) => {
    if (
      window.confirm("Are you sure you want to permanently delete this volume?")
    ) {
      try {
        await api.delete(`/admin/volumes/${volumeId}`);
        await fetchVolumes();
      } catch (err) {
        setError("Failed to delete volume.");
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-teal-400 mb-6">
        Greentext Volume Manager
      </h1>

      {/* --- The Form Section --- */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-white font-semibold mb-4">
          {editingId ? "Edit Volume" : "Create New Volume"}
        </h2>
        {editingId && (
          <button
            onClick={resetForm}
            className="text-sm text-teal-400 hover:text-teal-300 mb-4"
          >
            Cancel Edit
          </button>
        )}
      </div>
      <VolumeForm
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        loading={formLoading}
        submitButtonText={editingId ? "Update Volume" : "Create Volume"}
      />

      {/* --- The List Section --- */}
      <h2 className="text-2xl font-semibold text-white mt-10 mb-4">
        Existing Volumes
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
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
            {volumes.map((vol) => (
              <tr
                key={vol._id}
                className="border-b border-gray-700 hover:bg-gray-700/50"
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
                <td className="p-3">
                  {new Date(vol.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 space-x-4">
                  {/* The Edit button now just populates the form on this page */}
                  <button
                    onClick={() => handleEditClick(vol)}
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVolume(vol._id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolumesPage;

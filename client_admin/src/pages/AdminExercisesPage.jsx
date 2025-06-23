// src/pages/AdminExercisesPage.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminExercisesPage = () => {
    // State for the list of exercises and the form inputs
    const [exercises, setExercises] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [exerciseType, setExerciseType] = useState('Strength');

    // NEW state variables for better UI feedback
    const [loading, setLoading] = useState(true); // For the initial list loading
    const [formLoading, setFormLoading] = useState(false); // For when the form is submitting
    const [error, setError] = useState('');

    // This function fetches the list of all exercises.
    const fetchExercises = async () => {
        try {
            // The public route to get all exercises is still '/exercises'
            const res = await api.get('/exercises');
            setExercises(res.data.data);
        } catch (error) {
            console.error("Failed to fetch exercises:", error);
            setError('Could not load exercise definitions. Please try refreshing the page.');
        } finally {
            setLoading(false); // Done loading the list
        }
    };

    // Run fetchExercises once when the component mounts.
    useEffect(() => {
        fetchExercises();
    }, []);

    // Handler for submitting the "Add New Exercise" form.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true); // Start loading spinner on button
        setError(''); // Clear previous errors
        try {
            // Use the new, correct admin-only route.
            await api.post('/admin/exercises', { name, description, exerciseType });
            setName('');
            setDescription('');
            await fetchExercises(); // Refresh the list after successful creation
        } catch (error) {
            console.error("Error creating exercise:", error);
            setError(error.response?.data?.message || "Failed to create exercise.");
        } finally {
            setFormLoading(false); // Stop loading spinner
        }
    };

    // Handler for deleting an exercise.
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to permanently delete this exercise definition?")) {
            try {
                // Use the new, correct admin-only route.
                await api.delete(`/admin/exercises/${id}`);
                fetchExercises(); // Refresh the list
            } catch (error) {
                setError(error.response?.data?.message || "Failed to delete exercise.");
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-teal-400 mb-6">Manage Exercise Definitions</h1>
            
            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-800 rounded-lg">
                <h2 className="text-xl text-white font-semibold mb-4">Add New Exercise</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Exercise Name" value={name} onChange={e => setName(e.target.value)} required className="p-3 bg-gray-700 rounded border-gray-600 text-white" />
                    <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="p-3 bg-gray-700 rounded border-gray-600 text-white" />
                    <select value={exerciseType} onChange={e => setExerciseType(e.target.value)} className="p-3 bg-gray-700 rounded border-gray-600 text-white">
                        <option>Strength</option>
                        <option>Cardio</option>
                        <option>Flexibility</option>
                    </select>
                </div>
                {/* Display form-specific errors here */}
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                <button type="submit" disabled={formLoading} className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg disabled:bg-gray-500">
                    {formLoading ? 'Creating...' : 'Create Definition'}
                </button>
            </form>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">Existing Exercises</h2>
            {/* Conditional Rendering: Show loading, error, or data table */}
            {loading ? (
                <p className="text-gray-400">Loading definitions...</p>
            ) : (
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <table className="min-w-full text-left text-sm text-gray-300">
                        <thead className="bg-gray-900 text-xs uppercase"><tr><th className="p-3">Name</th><th className="p-3">Type</th><th className="p-3">Actions</th></tr></thead>
                        <tbody>
                            {exercises.map(ex => (
                                <tr key={ex._id} className="border-b border-gray-700">
                                    <td className="p-3 font-medium">{ex.name}</td>
                                    <td className="p-3">{ex.exerciseType}</td>
                                    <td className="p-3">
                                        <button onClick={() => handleDelete(ex._id)} className="text-red-500 hover:text-red-400">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminExercisesPage;
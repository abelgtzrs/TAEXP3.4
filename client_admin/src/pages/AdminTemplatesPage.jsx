// src/pages/AdminTemplatesPage.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminTemplatesPage = () => {
    // State for existing templates and all possible exercises
    const [templates, setTemplates] = useState([]);
    const [allExercises, setAllExercises] = useState([]);

    // State for the creation form
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedExercises, setSelectedExercises] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [templatesRes, exercisesRes] = await Promise.all([
            api.get('/workout-templates'),
            api.get('/exercises')
        ]);
        setTemplates(templatesRes.data.data);
        setAllExercises(exercisesRes.data.data);
    };

    const handleCheckboxChange = (exerciseId) => {
        setSelectedExercises(prev =>
            prev.includes(exerciseId)
                ? prev.filter(id => id !== exerciseId) // Uncheck: remove from array
                : [...prev, exerciseId] // Check: add to array
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/workout-templates', {
                name,
                description,
                exercises: selectedExercises
            });
            setName('');
            setDescription('');
            setSelectedExercises([]);
            fetchData(); // Refresh list
        } catch (error) {
            alert('Failed to create template.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-teal-400 mb-6">Manage Workout Templates</h1>
            
            {/* Form to create new templates */}
            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-800 rounded-lg">
                <h2 className="text-xl text-white font-semibold mb-4">Create New Template</h2>
                <div className="space-y-4">
                    <input type="text" placeholder="Template Name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 bg-gray-700 rounded" />
                    <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-gray-700 rounded" />
                    
                    <div>
                        <h3 className="text-lg text-white mb-2">Select Exercises</h3>
                        <div className="max-h-60 overflow-y-auto p-3 bg-gray-900 rounded-md grid grid-cols-2 md:grid-cols-3 gap-2">
                            {allExercises.map(ex => (
                                <label key={ex._id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedExercises.includes(ex._id)}
                                        onChange={() => handleCheckboxChange(ex._id)}
                                        className="form-checkbox bg-gray-600 text-teal-500"
                                    />
                                    <span>{ex.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <button type="submit" className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg">Create Template</button>
            </form>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">Existing Templates</h2>
            <div className="space-y-4">
                {templates.map(template => (
                    <div key={template._id} className="p-4 bg-gray-800 rounded-lg">
                        <h3 className="font-bold text-white">{template.name}</h3>
                        <ul className="text-xs text-gray-400 list-disc list-inside">
                            {template.exercises.map(ex => <li key={ex._id}>{ex.name}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminTemplatesPage;
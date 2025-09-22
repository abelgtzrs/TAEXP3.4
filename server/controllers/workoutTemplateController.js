// server/controllers/workoutTemplateController.js
const WorkoutTemplate = require("../models/WorkoutTemplate");

exports.createWorkoutTemplate = async (req, res) => {
  try {
    const { name, description, exercises } = req.body;
    const template = await WorkoutTemplate.create({
      name,
      description,
      exercises, // Expecting an array of ExerciseDefinition IDs
      createdBy: req.user.id,
    });
    res.status(201).json({ success: true, data: template });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getWorkoutTemplates = async (req, res) => {
  try {
    // Populate the exercises to show their names and details along with the template
    const templates = await WorkoutTemplate.find().populate("exercises", "name muscleGroups exerciseType");
    res.status(200).json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateWorkoutTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, exercises } = req.body;
    const template = await WorkoutTemplate.findByIdAndUpdate(
      id,
      { name, description, exercises },
      { new: true, runValidators: true }
    ).populate("exercises", "name muscleGroups exerciseType");
    if (!template) return res.status(404).json({ success: false, message: "Template not found" });
    res.status(200).json({ success: true, data: template });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteWorkoutTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await WorkoutTemplate.findByIdAndDelete(id);
    if (!template) return res.status(404).json({ success: false, message: "Template not found" });
    res.status(200).json({ success: true, message: "Template deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

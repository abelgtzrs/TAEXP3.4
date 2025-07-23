const Task = require("../models/userSpecific/Task");

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- THIS IS THE CORRECTED FUNCTION ---
// @desc    Update a task (including its sub-tasks)
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    // First, find the existing task in the database.
    let task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Destructure the incoming data from the request body.
    const { title, description, priority, dueDate, subTasks } = req.body;

    // Update the main properties of the task.
    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    // --- Sub-task Update Logic ---
    if (Array.isArray(subTasks)) {
      const newSubTasks = [];
      for (const subTaskData of subTasks) {
        // Check if the subtask already exists by looking for a valid MongoDB ID.
        const existingSubtask = task.subTasks.id(subTaskData._id);

        if (existingSubtask) {
          // If it exists, update its properties.
          existingSubtask.text = subTaskData.text;
          existingSubtask.isCompleted = subTaskData.isCompleted;
          newSubTasks.push(existingSubtask);
        } else {
          // If it's a new subtask (with a temporary ID like 'temp-123'),
          // create a new subdocument instance and add it.
          newSubTasks.push({
            text: subTaskData.text,
            isCompleted: subTaskData.isCompleted,
          });
        }
      }
      // Replace the old subTasks array with the new, updated one.
      task.subTasks = newSubTasks;
    }

    // Save the fully updated task document.
    const updatedTask = await task.save();

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    await task.deleteOne();
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- NEW SUBTASK CONTROLLERS ---

// @desc    Add a subtask to a specific task
// @route   POST /api/tasks/:id/subtasks
exports.addSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: "Subtask text is required" });
    }

    task.subTasks.push({ text });
    await task.save();
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update a specific subtask (e.g., toggle completion)
// @route   PUT /api/tasks/:id/subtasks/:subtaskId
exports.updateSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const subtask = task.subTasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({ success: false, message: "Subtask not found" });
    }

    // Update properties
    if (req.body.text) subtask.text = req.body.text;
    if (typeof req.body.isCompleted === "boolean") {
      subtask.isCompleted = req.body.isCompleted;
    }

    await task.save();
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a specific subtask
// @route   DELETE /api/tasks/:id/subtasks/:subtaskId
exports.deleteSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const subtask = task.subTasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({ success: false, message: "Subtask not found" });
    }

    subtask.remove();
    await task.save();
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

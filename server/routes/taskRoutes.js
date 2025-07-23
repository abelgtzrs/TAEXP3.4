const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
} = require("../controllers/taskController");

// Secure all routes in this file
router.use(protect);

// Route for GET (all tasks) and POST (create task)
router.route("/").get(getTasks).post(createTask);

// Route for PUT (update) and DELETE for a specific task
router.route("/:id").put(updateTask).delete(deleteTask);

// --- NEW SUBTASK ROUTES ---

// Route to add a subtask to a specific task
router.post("/:id/subtasks", addSubtask);

// Routes to update or delete a specific subtask
router.route("/:id/subtasks/:subtaskId").put(updateSubtask).delete(deleteSubtask);

module.exports = router;

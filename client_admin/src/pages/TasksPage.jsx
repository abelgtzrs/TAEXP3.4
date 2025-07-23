import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import api from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import StyledButton from "../components/ui/StyledButton";
import StyledInput from "../components/ui/StyledInput";
import { Check, Square, Trash2, Plus, Flag, Calendar, ChevronDown, ChevronUp } from "lucide-react";

// --- TaskModal Component ---
const TaskModal = ({ task, onClose, onUpdate, onDelete }) => {
  const [editedTask, setEditedTask] = useState(task);
  const [newSubtaskText, setNewSubtaskText] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubtaskChange = (subtaskId, field, value) => {
    const newSubTasks = editedTask.subTasks.map((st) => (st._id === subtaskId ? { ...st, [field]: value } : st));
    setEditedTask((prev) => ({ ...prev, subTasks: newSubTasks }));
  };

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    const newSubtask = { text: newSubtaskText, isCompleted: false, _id: `temp-${Date.now()}` };
    setEditedTask((prev) => ({ ...prev, subTasks: [...prev.subTasks, newSubtask] }));
    setNewSubtaskText("");
  };

  const handleRemoveSubtask = (subtaskId) => {
    const newSubTasks = editedTask.subTasks.filter((st) => st._id !== subtaskId);
    setEditedTask((prev) => ({ ...prev, subTasks: newSubTasks }));
  };

  const handleSave = () => {
    const finalTask = {
      ...editedTask,
      subTasks: editedTask.subTasks.map(({ _id, ...rest }) =>
        String(_id).startsWith("temp-") ? rest : { _id, ...rest }
      ),
    };
    onUpdate(finalTask._id, finalTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-surface w-full max-w-2xl rounded-lg border border-gray-700/50 p-6 space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <StyledInput
          name="title"
          value={editedTask.title}
          onChange={handleChange}
          className="text-xl font-bold bg-transparent border-0 p-0 focus:ring-0"
        />
        <textarea
          name="description"
          value={editedTask.description}
          onChange={handleChange}
          placeholder="Add a description..."
          className="w-full p-2 bg-gray-700 rounded h-24 text-sm text-text-secondary focus:outline-none focus:border-primary"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-text-secondary">Due Date</label>
            <StyledInput
              name="dueDate"
              type="date"
              value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split("T")[0] : ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-xs text-text-secondary">Priority</label>
            <select
              name="priority"
              value={editedTask.priority}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 rounded border border-gray-600"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-white mb-2">Sub-Tasks</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {editedTask.subTasks.map((st) => (
              <div key={st._id} className="flex items-center gap-2 group">
                <button onClick={() => handleSubtaskChange(st._id, "isCompleted", !st.isCompleted)}>
                  {st.isCompleted ? (
                    <Check size={16} className="text-primary" />
                  ) : (
                    <Square size={16} className="text-text-secondary" />
                  )}
                </button>
                <input
                  type="text"
                  value={st.text}
                  onChange={(e) => handleSubtaskChange(st._id, "text", e.target.value)}
                  className="flex-grow bg-transparent text-sm text-text-main w-full"
                />
                <button
                  onClick={() => handleRemoveSubtask(st._id)}
                  className="text-gray-600 hover:text-status-danger opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <StyledInput
              type="text"
              placeholder="Add new sub-task..."
              value={newSubtaskText}
              onChange={(e) => setNewSubtaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSubtask())}
              className="text-sm py-1"
            />
            <StyledButton onClick={handleAddSubtask} className="py-1 px-3">
              <Plus size={16} />
            </StyledButton>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
          <StyledButton
            onClick={() => {
              onDelete(task._id);
              onClose();
            }}
            className="bg-status-danger/80 hover:bg-status-danger"
          >
            Delete Task
          </StyledButton>
          <div className="flex gap-2">
            <StyledButton onClick={onClose} className="bg-gray-600 hover:bg-gray-500">
              Cancel
            </StyledButton>
            <StyledButton onClick={handleSave}>Save Changes</StyledButton>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component for a single Task Card ---
const TaskCard = ({ task, index, onCardClick, onUpdateSubtask }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const priorityColors = {
    low: "border-transparent",
    medium: "border-l-blue-500",
    high: "border-l-yellow-500",
    urgent: "border-l-red-500",
  };
  const completedCount = task.subTasks.filter((st) => st.isCompleted).length;
  const progress = task.subTasks.length > 0 ? (completedCount / task.subTasks.length) * 100 : 0;

  const handleSubtaskClick = (e, subtaskId, isCompleted) => {
    e.stopPropagation();
    onUpdateSubtask(task, subtaskId, isCompleted);
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 bg-surface rounded-lg border-l-4 ${
            priorityColors[task.priority]
          } mb-4 cursor-pointer hover:bg-gray-700/50 transition-colors duration-200`}
        >
          <div onClick={() => onCardClick(task)} className="cursor-pointer">
            <h3 className="font-semibold text-text-main">{task.title}</h3>
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-text-secondary mt-2">
                <Calendar size={12} />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {task.subTasks.length > 0 && (
            <div className="mt-3">
              <div className="flex justify-between items-center text-xs text-text-tertiary mb-1">
                <span>Progress</span>
                <span>
                  {completedCount} / {task.subTasks.length}
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-1">
                <div
                  className="bg-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-text-secondary hover:text-white mt-2 flex items-center gap-1"
              >
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span>{isExpanded ? "Hide" : "Show"} Sub-tasks</span>
              </button>

              {isExpanded && (
                <div className="mt-2 space-y-2 animate-fade-in">
                  {task.subTasks.map((st) => (
                    <div
                      key={st._id}
                      onClick={(e) => handleSubtaskClick(e, st._id, !st.isCompleted)}
                      className="flex items-center gap-2 text-sm text-text-secondary hover:bg-gray-900/50 p-1 rounded"
                    >
                      {st.isCompleted ? (
                        <Check size={16} className="text-primary flex-shrink-0" />
                      ) : (
                        <Square size={16} className="flex-shrink-0" />
                      )}
                      <span className={st.isCompleted ? "line-through text-text-tertiary" : ""}>{st.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

// --- Sub-Component for a Task Column ---
const TaskColumn = ({ title, status, tasks, onCardClick, onUpdateSubtask, onDelete }) => (
  <div className="bg-background/50 p-4 rounded-lg w-full flex flex-col">
    <h2 className="text-lg font-bold text-white mb-4 px-2">
      {title} ({tasks.length})
    </h2>
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex-grow min-h-[200px] rounded-md transition-colors ${
            snapshot.isDraggingOver ? "bg-surface/50" : ""
          }`}
        >
          {tasks.map((task, index) => (
            <TaskCard
              key={task._id}
              task={task}
              index={index}
              onCardClick={onCardClick}
              onUpdateSubtask={onUpdateSubtask}
              onDelete={onDelete}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

// --- Main Page Component (Corrected) ---
const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  // --- THIS IS THE FIX: The handler functions are now fully implemented ---

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks");
      setTasks(res.data.data);
    } catch (error) {
      setError("Could not load your tasks.");
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setFormLoading(true);
    try {
      const response = await api.post("/tasks", { title: newTaskTitle, status: "todo" });
      setTasks((prevTasks) => [...prevTasks, response.data.data]);
      setNewTaskTitle("");
    } catch (error) {
      setError("Error creating task.");
      console.error("Error creating task:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (taskId, updateData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updateData);
      setTasks((prevTasks) => prevTasks.map((t) => (t._id === taskId ? response.data.data : t)));
    } catch (error) {
      setError("Could not update the task.");
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/tasks/${taskId}`);
        setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));
      } catch (error) {
        setError("Could not delete the task.");
        console.error("Error deleting task:", error);
      }
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    const task = tasks.find((t) => t._id === draggableId);
    if (task.status !== destination.droppableId) {
      setTasks((prev) => prev.map((t) => (t._id === draggableId ? { ...t, status: destination.droppableId } : t)));
      try {
        await api.put(`/tasks/${draggableId}`, { status: destination.droppableId });
      } catch (error) {
        setError("Failed to sync task status. Reverting change.");
        setTasks((prev) => prev.map((t) => (t._id === draggableId ? { ...t, status: source.droppableId } : t)));
      }
    }
  };

  const handleUpdateSubtask = async (task, subtaskId, isCompleted) => {
    const newSubTasks = task.subTasks.map((st) => (st._id === subtaskId ? { ...st, isCompleted } : st));
    setTasks((prevTasks) => prevTasks.map((t) => (t._id === task._id ? { ...t, subTasks: newSubTasks } : t)));
    try {
      await api.put(`/tasks/${task._id}`, { subTasks: newSubTasks });
    } catch (error) {
      setError("Failed to sync sub-task. Reverting.");
      setTasks((prevTasks) => prevTasks.map((t) => (t._id === task._id ? task : t)));
    }
  };

  const tasksTodo = tasks.filter((t) => t.status === "todo");
  const tasksInProgress = tasks.filter((t) => t.status === "in-progress");
  const tasksCompleted = tasks.filter((t) => t.status === "completed");

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <PageHeader title="Task Manager" subtitle="Organize your objectives. Drag tasks to change their status." />

        <form onSubmit={handleCreateTask} className="flex gap-2 mb-8">
          <StyledInput
            type="text"
            placeholder="Add a new task to 'To Do'..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <StyledButton type="submit" loading={formLoading}>
            <Plus size={20} />
          </StyledButton>
        </form>

        {error && <div className="text-center text-red-500 py-4">{error}</div>}

        {loading ? (
          <p className="text-center text-text-secondary">Loading tasks...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
            <TaskColumn
              title="To Do"
              status="todo"
              tasks={tasksTodo}
              onCardClick={setEditingTask}
              onUpdateSubtask={handleUpdateSubtask}
              onDelete={handleDeleteTask}
            />
            <TaskColumn
              title="In Progress"
              status="in-progress"
              tasks={tasksInProgress}
              onCardClick={setEditingTask}
              onUpdateSubtask={handleUpdateSubtask}
              onDelete={handleDeleteTask}
            />
            <TaskColumn
              title="Completed"
              status="completed"
              tasks={tasksCompleted}
              onCardClick={setEditingTask}
              onUpdateSubtask={handleDeleteTask}
            />
          </div>
        )}
      </div>
      {editingTask && (
        <TaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      )}
    </DragDropContext>
  );
};

export default TasksPage;

const mongoose = require("mongoose");

const SubTaskSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
  },
  { _id: true }
); // Use default _id for sub-tasks to make them easier to target

const TaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a title for the task"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    subTasks: [SubTaskSchema], // Array of sub-tasks
    completedDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Middleware to set completedDate when status is changed to 'completed'
TaskSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "completed" && !this.completedDate) {
    this.completedDate = Date.now();
  }
  next();
});

module.exports = mongoose.model("Task", TaskSchema);

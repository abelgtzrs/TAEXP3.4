// server/models/userSpecific/Task.js
const mongoose = require("mongoose");

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
      enum: ["todo", "in-progress", "completed", "on-hold", "archived"],
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
    // projectOrCategory: { type: String, default: 'General' } // Optional
    // tags: [String] // Optional
    completedDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt

// When status changes to 'completed', set completedDate
TaskSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "completed" &&
    !this.completedDate
  ) {
    this.completedDate = Date.now();
  } else if (this.isModified("status") && this.status !== "completed") {
    this.completedDate = null; // Clear if moved out of completed
  }
  next();
});

module.exports = mongoose.model("Task", TaskSchema);

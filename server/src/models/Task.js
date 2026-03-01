import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskTitle: {
      type: String,
      required: true,
      trim: true
    },
    taskDescription: {
      type: String,
      required: true,
      trim: true
    },
    taskDate: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: "General",
      trim: true
    },
    status: {
      type: String,
      enum: ["newTask", "active", "completed", "failed"],
      default: "newTask"
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;

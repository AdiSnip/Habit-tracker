import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userID:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:      { type: String, required: true },
  description:{ type: String },
  priority:{ type: String, default: "Low" },
  dueDate:    { type: Date, default: Date.now },
  // category:   { type: String },

  isCompleted:{ type: Boolean, default: false },
  completedAt:{ type: Date },

  xpValue:    { type: Number, default: 10 },

  createdAt:  { type: Date, default: Date.now }
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default Task;

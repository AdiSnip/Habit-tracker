import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  daily: [
    {
      date: { type: Date },
      tasksCompleted: { type: Number, default: 0 },
      xpEarned: { type: Number, default: 0 }
    }
  ],

  weekly: [
    {
      weekStart: { type: Date },
      tasksCompleted: { type: Number },
      xpEarned: { type: Number }
    }
  ],

  monthly: [
    {
      month: { type: String },
      tasksCompleted: { type: Number },
      xpEarned: { type: Number }
    }
  ]
});

const Analytics = mongoose.models.Analytics || mongoose.model("Analytics", analyticsSchema);
export default Analytics;

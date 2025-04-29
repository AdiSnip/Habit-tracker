import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  xp:       { type: Number, default: 0 },
  level:    { type: Number, default: 1 },
  badges:   [{ type: String, default: {} }],

  streak: {
    current: { type: Number, default: 0 },
    highest: { type: Number, default: 0 },
    lastCompleted: { type: Date },
  },

  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

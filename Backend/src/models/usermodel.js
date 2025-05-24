import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  name: { type: String }, // New field to prevent the name_1 index error
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  xp:       { type: Number, default: 0 },
  limitxp:   { type: Number, default: 100 },
  level:    { type: Number, default: 1 },
  badges:   [{ type: String, default: {} }],

  streak: {
    current: { type: Number, default: 0 },
    highest: { type: Number, default: 0 },
    lastCompleted: { type: Date },
  },

  createdAt: { type: Date, default: Date.now }
});

// Hash password if changed
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Generate full name before saving
  this.name = `${this.firstname} ${this.lastname}`;
  
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

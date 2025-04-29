import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
userSchema.pre("save", async function (next){
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
})

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

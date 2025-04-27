import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  icon:        { type: String },
  condition:   { type: String },
});

const Badge = mongoose.models.Badge || mongoose.model("Badge", badgeSchema);
export default Badge;

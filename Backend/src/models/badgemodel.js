import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { 
    type: String, 
    required: true,
    enum: [
      "Beginner",
      "Intermediate",
      "Advanced",
      "Expert",
      "Master",
      "Legendary",
    ]
  },
  description: { type: String },
  icon:        { 
    type: String, 
    default: "default-icon.png" // you can provide a default icon here
  },
  condition:   { type: String },
});

badgeSchema.index({ userId: 1, name: 1 }, { unique: true });  // Enforcing uniqueness


const Badge = mongoose.models.Badge || mongoose.model("Badge", badgeSchema);
export default Badge;

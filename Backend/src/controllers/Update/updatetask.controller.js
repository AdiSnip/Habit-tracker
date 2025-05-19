import Task from "../../models/tasksmodel.js";
import User from "../../models/usermodel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const updateTask = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const { title, dueDate, priority, description, isCompleted } = req.body;  // include isCompleted
  const taskId = req.params.id;

  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(400).json({ message: "Token is unauthorized or unavailable" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res.status(401).json({ message: "User not found" });

    const updateData = { title, dueDate, priority, description };

    // Only add isCompleted if it is explicitly passed
    if (typeof isCompleted === "boolean") {
      updateData.isCompleted = isCompleted;
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true }
    );

    if (!task)
      return res.status(401).json({ message: "Error in task update" });

    return res.status(200).json({ success: true, task });
  } catch (error) {
    console.error("Error in task update:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default updateTask;
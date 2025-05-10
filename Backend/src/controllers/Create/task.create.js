import Task from "../../models/tasksmodel.js";
import User from "../../models/usermodel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createTask = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const { title, dueDate, priority, description } = req.body;

  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(400).json({ message: "Token is unauthorized or unavailable" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    const task = await Task.create({
      userID: user.id,
      title,
      dueDate,
      priority,
      description,
      isCompleted: false,
      xpValue: 10,
      createdAt: Date.now(),
    });

    if (!task)
      return res.status(401).json({ message: "Error in task creation" });

    return res.status(201).json({ success: true, task });
  } catch (error) {
    console.error("Error in task creation:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default createTask;

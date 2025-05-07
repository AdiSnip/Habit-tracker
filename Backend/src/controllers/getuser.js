import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';
import Badge from '../models/badgemodel.js';
import Task from '../models/tasksmodel.js';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const getUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // exclude password
    const badges = await Badge.find({ userId: user._id });
    const tasks = await Task.find({ userID: user._id });
    if(!tasks) return res.status(200).json({ message: "No tasks found" });
    if (!badges) {
      return res.status(404).json({ message: "Badges not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const data = [user, badges, !tasks? [] : tasks];

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid Token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default getUser;

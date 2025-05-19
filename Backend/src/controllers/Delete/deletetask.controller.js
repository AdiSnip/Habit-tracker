import Task from "../../models/tasksmodel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const deletetask = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.id) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const taskId = req.params.id;

        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(200).json({ message: "Task deleted successfully" });

    } catch (error) {
        console.error("Error deleting task:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

export default deletetask;

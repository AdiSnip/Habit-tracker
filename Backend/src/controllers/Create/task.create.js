import Task from "../../models/tasksmodel.js";
import User from "../../models/usermodel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

let createTask = async (req,res)=>{
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        let token = req.cookies.token;
        if(!token) return res.status(400).json({message : "token is unauthorised or unavailable"});

        const decoded = jwt.verify(token,JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        const task = await Task.create({
            userID: user.id,
            title: req.body.title,
            description: req.body.description,
            isCompleted: false,
            xpValue: 10,
            createdAt: Date.now()
        })
        if(!task) return res.status(401).json({message : "error in task creation"});
        return res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        console.error("error in task creation",error)
    }
}

export default createTask;
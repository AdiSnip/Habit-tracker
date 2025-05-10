import Task from "../../models/tasksmodel.js";
import User from "../../models/usermodel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

const readTask = async (req, res)=>{
    const JWT_SECRET = process.env.JWT_SECRET;
    try {
        const token = req.cookies.token;
        if(!token) return res.status(400).json({message : "token is unauthorised or unavailable"});
        const decoded = jwt.verify(token,JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        const tasks = await Task.find({userID: user.id})
        if(!tasks) return res.status(401).json({message : "error in task read"});
        return res.status(200).json({tasks});
    } catch (error) {
        console.error("error in task read",error)
        
    }
}

export default readTask;
// import Task from "../../models/tasksmodel.js";
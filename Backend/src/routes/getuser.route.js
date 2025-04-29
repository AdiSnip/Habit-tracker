import { Router } from "express";
import getUser from "../controllers/getuser.js";

const userdata = Router();

// Route to get user data
userdata.get('/', getUser);

export default userdata;

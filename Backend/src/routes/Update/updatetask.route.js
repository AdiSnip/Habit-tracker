import { Router } from "express";
import updateTask from "../../controllers/Update/updatetask.controller.js";

const updatetask = Router();
updatetask.patch("/:id", updateTask);

export default updatetask;
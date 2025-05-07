import createTask from "../../controllers/Create/task.create.js";
import Router from "express"

const createTaskRoute = Router()
createTaskRoute.post('/', createTask);

export default createTaskRoute;
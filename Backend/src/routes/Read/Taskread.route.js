import {Router} from 'express';
import readTask from '../../controllers/Read/Taskread.controller.js';

const readTaskRouter = Router();
readTaskRouter.get('/', readTask);


export default readTaskRouter;
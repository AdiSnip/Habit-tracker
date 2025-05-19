import { Router } from 'express';
import deletetask from "../../controllers/Delete/deletetask.controller.js";

const deletetaskrouter = Router();
deletetaskrouter.delete('/:id', deletetask); // <== CORRECT
export default deletetaskrouter;

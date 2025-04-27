import Router from 'express';
import { createuser } from '../controllers/register.js';

const router = Router();

router.post('/register', createuser);

export default router;
// This code defines a route for user registration in an Express application. It imports the necessary modules, creates a router instance, and sets up a POST route at '/register' that calls the `createuser` function from the `register` controller when a request is made to that endpoint. Finally, it exports the router for use in other parts of the application.
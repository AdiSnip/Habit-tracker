import { Router } from "express";
import { loginuser } from "../controllers/userauth.js";

const login = Router();
login.post('/', loginuser);
export default login;
// This code defines a route for user login in an Express application. It imports the necessary modules, creates a router instance, and sets up a POST route at '/login' that calls the `loginuser` function from the `userauth` controller when a request is made to that endpoint. Finally, it exports the router for use in other parts of the application.
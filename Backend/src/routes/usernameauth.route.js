import unauth from "../controllers/username_authenticator.js";
import { Router } from "express";
const usernameauth = Router();
usernameauth.post('/', unauth);
export default usernameauth;

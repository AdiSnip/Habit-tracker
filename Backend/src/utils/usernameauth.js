import User from "../models/usermodel.js";

async function usernameAuth(username) {
    const users = await User.find({ username });
    return users.length > 0; // true if username exists, false otherwise
}
export default usernameAuth;
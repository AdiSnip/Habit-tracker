import usernameauth from "../utils/usernameauth.js"

let unauth = async (req, res) => {
    const {username} = req.body;
    if (!username) {
        return res.status(400).json({ message: "Username is required." });
    }
    try {
        let users = await usernameauth(username);
        (users)?res.status(200).json({ message: "Username already exists." }):res.status(200).json({ message: "Username is available." });
    } catch (error) {
        return res.status(500).json({ message: "Server error." });
        
    }
}
export default unauth;
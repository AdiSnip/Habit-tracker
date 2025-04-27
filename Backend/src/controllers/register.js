import User from "../models/usermodel.js";

const createuser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({
            name,
            email,
            password,
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export { createuser };
// Compare this snippet from Backend/src/routes/user.js:
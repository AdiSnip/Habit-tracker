import User from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createuser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists. Please login." }); // Send JSON, don't redirect here
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            xp: 0,
            level: 1,
            badges: [],
            streak: {
                current: 0,
                highest: 0,
                lastCompleted: null,
            },
            createdAt: new Date(),
        });

        const userObj = user.toObject();
        delete userObj.password;

        jwt.sign({ id: userObj._id }, process.env.JWT_SECRET, (err, token) => {
            if (err) {
                return res.status(500).json({ message: "Error generating token." });
            }
            res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 60 * 24 * 60 * 60 * 1000 }); // Cookie set

            return res.status(201).redirect('/'); // Redirect to the home page after successful registration
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const loginuser = async (req, res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"Email and password are required."});
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }
    try {
        User.findOne({email}).then(async (user) => {
            if(!user){
                return res.status(400).json({message:"user not found"});
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if(!passwordMatch){
                return res.status(400).json({message:"Invalid password"});
            }
            jwt.sign({ id: user._id }, process.env.JWT_SECRET, (err, token) => {
                if (err) {
                    return res.status(500).json({ message: "Error generating token." });
                }
                res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 60 * 24 * 60 * 60 * 1000 }); // Cookie set
                return res.status(200).redirect('/'); // Redirect to the home page after successful login
            });        })
    } catch (error) {
        return res.status(400).json({error:error.message});
    }
}

export { createuser, loginuser };
// Compare this snippet from Backend/src/routes/user.route.js:
// Compare this snippet from Backend/src/routes/user.js:
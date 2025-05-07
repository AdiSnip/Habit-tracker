import User from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Badge from "../models/badgemodel.js";
import usernameAuth from "../utils/usernameauth.js";
import dotenv from "dotenv";
dotenv.config();

const createuser = async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;

    if (!firstname || !lastname || !username || !email || !password) {
        return res.status(400).json({ message: "Name, email, username, and password are required." });
    }
    if (username.length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters long." });
    }
    
    const usernameExists = await usernameAuth(username);
    if (usernameExists) {
        return res.status(400).json({ message: "Username already exists. Please choose another." });
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
            return res.status(400).json({ message: "Email already exists. Please login." });
        }

        // Create the user (no need to manually hash the password, it's handled by the pre hook in the model)
        const user = await User.create({
            firstname,
            lastname,
            username,
            email,
            password, // plain password is passed, it will be hashed automatically in the model's pre hook
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

        // Check if the "Beginner" badge already exists for the user
        const existingBadge = await Badge.findOne({ userId: user._id, name: "Beginner" });
        if (!existingBadge) {
            // Create default badge for the user
            await Badge.create({
                userId: user._id,
                name: "Beginner",
                description: "Complete your first task.",
            });
        }

        const userObj = user.toObject();
        delete userObj.password; // Don't send password in the response

        jwt.sign({ id: userObj._id }, process.env.JWT_SECRET, (err, token) => {
            if (err) {
                return res.status(500).json({ message: "Error generating token." });
            }
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Secure in production
                maxAge: 60 * 24 * 60 * 60 * 1000,
                sameSite: 'Strict', // Prevent CSRF
            });

            return res.status(201).json({ message: "Registration successful" });
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};



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
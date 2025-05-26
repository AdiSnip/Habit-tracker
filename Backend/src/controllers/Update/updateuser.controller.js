import User from "../../models/usermodel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// Update user information
const updateUser = async (req, res) => {
  const { firstname, lastname, username, email, password, xp, limitxp, level } = req.body;

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Token expired or missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    const updatedFields = {
      firstname,
      lastname,
      username,
      email,
      xp,
      limitxp,
      level,
    };

    if (password) {
      // 🚨 Hash password before saving it if you're allowing updates
      updatedFields.password = password; // <- Only safe if hashed in a Mongoose hook
    }

    const user = await User.findByIdAndUpdate(userID, updatedFields, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update user XP - controller (no change needed for PATCH method)
const updateXP = async (req, res) => {
  let { xp, limitxp, level } = req.body;

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Token expired or missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    xp = Number(xp);
    limitxp = Number(limitxp);
    level = Number(level);

    if ([xp, limitxp, level].some(val => isNaN(val))) {
      return res.status(400).json({ message: "Invalid XP, limit, or level" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { xp, limitxp, level },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("XP Update Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export { updateUser, updateXP };

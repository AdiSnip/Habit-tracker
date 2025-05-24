import User from "../../models/usermodel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

// Update user information
const updateUser = async (req, res) => {
  const { firstname, lastname, username, email, password, xp, limitxp, level} = req.body;
  const userId = req.userId;

  try {
    // Find the user by ID and update their information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstname, lastname, username, email, password, xp, limitxp, level },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User information updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export default updateUser;
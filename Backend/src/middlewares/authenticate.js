// middleware/authenticate.js
import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id; // Set for use in controller
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticate;

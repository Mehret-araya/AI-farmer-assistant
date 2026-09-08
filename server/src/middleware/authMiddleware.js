import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check whether Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Extract token
    const token = authHeader.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the verified token contains a user ID
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    // Find the current user in the database
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found",
      });
    }

    // Store authenticated user information on the request
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default protect;
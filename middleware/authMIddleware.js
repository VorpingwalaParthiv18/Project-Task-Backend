import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from "../models/user.js";
config();
export const protect = async (req, res, next) => {
  console.log("Token:", req.cookies.token);

  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const currentUser = await User.findById(decoded.id);
    console.log("User ID from Token:", decoded.id);
    console.log("Current User:", currentUser);

    if (!currentUser)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });

    req.user = currentUser;
    next();
  } catch (error) {
    console.log("Auth Error:", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid token", error: error.message });
  }
};


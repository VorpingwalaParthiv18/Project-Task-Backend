import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export async function registerUser(req, res) {
  try {
    const { email, password } = req.body;
    console.log("Registering user with email:", email);
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const newUser = await User.create({ email, password });
    const token = generateToken(newUser._id);

  
    res
      .cookie("token", token, {
        httpOnly: true, // not accessible by JS
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: "strict",
      })
      .status(201)
      .json({
        success: true,
        data: { _id: newUser._id, email: newUser.email, token },
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = generateToken(existingUser._id);

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
      })
      .status(200)
      .json({
        success: true,
        data: { _id: existingUser._id, email: existingUser.email, token },
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}



export async function logout(req, res) {
  try {
    res.clearCookie("token", { path: "/" });
    res.clearCookie("email", { path: "/" });
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}



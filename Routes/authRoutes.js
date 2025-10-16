import { Router } from "express";
import {
  registerUser,
  loginUser,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMIddleware.js";
const router = Router();

router.post("/register", registerUser); // POST /auth/register
router.post("/login", loginUser); // POST /auth/login
router.post("/logout", logout);

router.get("/me", protect, (req, res) => {
  if (req.user) {
    res.json({ email: req.user.email, token: req.cookies.token });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

export default router;

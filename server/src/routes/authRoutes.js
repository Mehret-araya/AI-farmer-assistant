
import express from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  getMe,
  exportMyData,
  deleteMyAccount,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

router.post("/register", authLimiter, register);

router.post("/login", authLimiter, login);
router.get("/me", protect, getMe);

router.get("/export", protect, exportMyData);
router.delete("/account", protect, deleteMyAccount);

export default router;



import express from "express";

import {
  register,
  login,
  getMe,
  exportMyData,
  deleteMyAccount,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", protect, getMe);

router.get("/export", protect, exportMyData);
router.delete("/account", protect, deleteMyAccount);

export default router;


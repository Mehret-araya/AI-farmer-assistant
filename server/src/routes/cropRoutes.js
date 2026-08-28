import express from "express";

import {
  createCrop,
  getCrops,
  getCropById,
  updateCrop,
  deleteCrop,
} from "../controllers/cropController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createCrop);
router.get("/", protect, getCrops);
router.get("/:id", protect, getCropById);
router.put("/:id", protect, updateCrop);
router.delete("/:id", protect, deleteCrop);

export default router;
import express from "express";
import multer from "multer";

import protect from "../middleware/authMiddleware.js";
import { uploadCropImage } from "../controllers/cropImageController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/:cropId/images",
  protect,
  upload.single("image"),
  uploadCropImage
);

export default router;
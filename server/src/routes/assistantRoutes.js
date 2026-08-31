import express from "express";

import { askFarmerAssistant } from "../controllers/assistantController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, askFarmerAssistant);

export default router;
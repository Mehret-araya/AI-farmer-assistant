import express from "express";

import { searchKnowledge } from "../controllers/knowledgeController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", protect, searchKnowledge);

export default router;
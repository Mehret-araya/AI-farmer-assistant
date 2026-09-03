import express from "express";
import { searchKnowledge } from "../controllers/knowledgeController.js";

const router = express.Router();

router.get("/search", searchKnowledge);

export default router;
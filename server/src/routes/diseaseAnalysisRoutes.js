import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  analyzeDisease,
  getCropAnalyses,
} from "../controllers/diseaseAnalysisController.js";

const router = express.Router();

// Analyze a specific image belonging to a crop
router.post(
  "/:cropId/images/:imageId/analyze",
  protect,
  analyzeDisease
);

// Get all analyses for a crop
router.get(
  "/:cropId/analyses",
  protect,
  getCropAnalyses
);

export default router;

import { askAssistant } from "../ai/assistantClient.js";
import Crop from "../models/Crop.js";
import DiseaseAnalysis from "../models/DiseaseAnalysis.js";

export const askFarmerAssistant = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Get the logged-in farmer's crops
    const crops = await Crop.find({
      userId: req.user.userId,
    }).select(
      "name variety plantingDate growthStage location farmSize"
    );

    // Get the logged-in farmer's recent disease analyses
    const analyses = await DiseaseAnalysis.find({
      userId: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    // Build crop context
    const cropContext =
      crops.length > 0
        ? crops
            .map(
              (crop) =>
                `Crop: ${crop.name}, Variety: ${
                  crop.variety || "Not specified"
                }, Planting date: ${
                  crop.plantingDate
                    ? crop.plantingDate
                        .toISOString()
                        .split("T")[0]
                    : "Not specified"
                }, Growth stage: ${
                  crop.growthStage || "Not specified"
                }, Location: ${
                  crop.location || "Not specified"
                }, Farm size: ${
                  crop.farmSize ?? 0
                }`
            )
            .join("\n")
        : "The farmer has not added any crops yet.";

    // Build disease-analysis context
    const diseaseContext =
      analyses.length > 0
        ? analyses
            .map(
              (analysis) =>
                `Disease: ${
                  analysis.disease
                }, Confidence: ${
                  analysis.confidence
                }, Explanation: ${
                  analysis.explanation ||
                  "Not available"
                }, Recommendation: ${
                  analysis.recommendation ||
                  "Not available"
                }`
            )
            .join("\n")
        : "No previous disease analyses are available.";

    // Combine farmer context with the question
    const contextualQuestion = `
You are an agricultural assistant helping a farmer.

Farmer's crop information:
${cropContext}

Recent disease analysis information:
${diseaseContext}

Farmer's question:
${question.trim()}

Give practical and safe agricultural advice.

Use the farmer's crop information and disease-analysis
information when relevant.

Do not invent facts about the farmer's farm.

If the available information is insufficient, clearly say
what additional information is needed.

If a disease analysis has low confidence or is "Uncertain",
do not present it as a confirmed diagnosis.
`;

    const answer = await askAssistant(contextualQuestion);

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("Assistant error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get assistant response",
    });
  }
};
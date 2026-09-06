import {
  getFarmerCrops,
  getFarmerDiseaseAnalyses,
  getFarmerWeather,
  getAgriculturalKnowledge,
} from "./farmerAgentTools.js";

import { decideAgentNeeds } from "./farmerAgentDecisionService.js";

export const runFarmerAgent = async ({
  userId,
  question,
  language = "en",
}) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!question || !question.trim()) {
    throw new Error("Question is required");
  }

  const cleanQuestion = question.trim();

  // Decide which information the agent needs.
  const decision = decideAgentNeeds(cleanQuestion, language);

  let crops = [];
  let diseaseAnalyses = [];
  let weather = null;
  let knowledge = [];

  const toolErrors = [];

  // Call only the tools required by the decision.
  if (decision.needsCrops) {
    try {
      crops = await getFarmerCrops(userId);
    } catch (error) {
      console.error("Farmer crops tool error:", error.message);

      toolErrors.push({
        tool: "crops",
        message: "Crop information is temporarily unavailable.",
      });
    }
  }

  if (decision.needsDiseaseAnalyses) {
    try {
      diseaseAnalyses = await getFarmerDiseaseAnalyses(userId);
    } catch (error) {
      console.error(
        "Farmer disease analysis tool error:",
        error.message
      );

      toolErrors.push({
        tool: "diseaseAnalyses",
        message:
          "Disease analysis information is temporarily unavailable.",
      });
    }
  }

  if (decision.needsWeather) {
    try {
      weather = await getFarmerWeather(userId);
    } catch (error) {
      console.error("Farmer weather tool error:", error.message);

      toolErrors.push({
        tool: "weather",
        message: "Weather information is temporarily unavailable.",
      });
    }
  }

  if (decision.needsKnowledge) {
    try {
      knowledge = await getAgriculturalKnowledge({
        question: cleanQuestion,
        language,
      });
    } catch (error) {
      console.error(
        "Agricultural knowledge tool error:",
        error.message
      );

      toolErrors.push({
        tool: "knowledge",
        message:
          "Agricultural knowledge information is temporarily unavailable.",
      });
    }
  }

  return {
  question: cleanQuestion,
  language,
  decision,
  crops,
  diseaseAnalyses,
  weather,
  knowledge,
  toolErrors,
  executionStatus:
    toolErrors.length > 0
      ? "partial_success"
      : "success",
};
};
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
  const decision = decideAgentNeeds(cleanQuestion);

  let crops = [];
  let diseaseAnalyses = [];
  let weather = null;
  let knowledge = [];

  // Call only the tools required by the decision.
  if (decision.needsCrops) {
    crops = await getFarmerCrops(userId);
  }

  if (decision.needsDiseaseAnalyses) {
    diseaseAnalyses = await getFarmerDiseaseAnalyses(userId);
  }

  if (decision.needsWeather) {
    weather = await getFarmerWeather(userId);
  }

  if (decision.needsKnowledge) {
    knowledge = await getAgriculturalKnowledge({
      question: cleanQuestion,
      language,
    });
  }

  return {
    question: cleanQuestion,
    language,
    decision,
    crops,
    diseaseAnalyses,
    weather,
    knowledge,
  };
};
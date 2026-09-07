import {
  getFarmerCrops,
  getFarmerDiseaseAnalyses,
  getFarmerWeather,
  getAgriculturalKnowledge,
} from "./farmerAgentTools.js";

import { decideAgentNeeds } from "./farmerAgentDecisionService.js";
import { validateAgentDecision } from "./farmerAgentSafetyService.js";
import {
  validateFarmerAgentToolResult,
} from "./farmerAgentResultValidationService.js";

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
  const safetyCheck = validateAgentDecision(decision);

  let crops = [];
  let diseaseAnalyses = [];
  let weather = null;
  let knowledge = [];

  const toolErrors = [];

const toolsUsed = [];

const toolResults = {
  crops: "not_selected",
  diseaseAnalyses: "not_selected",
  weather: "not_selected",
  knowledge: "not_selected",
};
  // Call only the tools required by the decision.
  if (decision.needsCrops) {
  toolsUsed.push("crops");
  toolResults.crops = "running";
try {
  crops = await getFarmerCrops(userId);

  const validation = validateFarmerAgentToolResult(
    "crops",
    crops
  );

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  toolResults.crops = "success";
} catch (error) {
  console.error("Farmer crops tool error:", error.message);
  toolResults.crops = "failed";

  crops = [];

  toolErrors.push({
    tool: "crops",
    message: "Crop information is temporarily unavailable.",
  });
}
 
  if (decision.needsDiseaseAnalyses) {
  toolsUsed.push("diseaseAnalyses");
  toolResults.diseaseAnalyses = "running";

  try {
  diseaseAnalyses = await getFarmerDiseaseAnalyses(userId);

  const validation = validateFarmerAgentToolResult(
    "diseaseAnalyses",
    diseaseAnalyses
  );

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  toolResults.diseaseAnalyses = "success";
} catch (error) {
  console.error(
    "Farmer disease analyses tool error:",
    error.message
  );

  toolResults.diseaseAnalyses = "failed";

  diseaseAnalyses = [];

  toolErrors.push({
    tool: "diseaseAnalyses",
    message:
      "Disease analysis information is temporarily unavailable.",
  });
}
}

  
if (decision.needsWeather) {
  toolsUsed.push("weather");
  toolResults.weather = "running";

 try {
  weather = await getFarmerWeather(userId);

  const validation = validateFarmerAgentToolResult(
    "weather",
    weather
  );

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  toolResults.weather = "success";
} catch (error) {
  console.error(
    "Farmer weather tool error:",
    error.message
  );

  toolResults.weather = "failed";

  weather = null;

  toolErrors.push({
    tool: "weather",
    message: "Weather information is temporarily unavailable.",
  });
}
}
  if (decision.needsKnowledge) {
  toolsUsed.push("knowledge");
  toolResults.knowledge = "running";

  try {
  knowledge = await getAgriculturalKnowledge({
    question,
    language,
    disease,
  });

  const validation = validateFarmerAgentToolResult(
    "knowledge",
    knowledge
  );

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  toolResults.knowledge = "success";
} catch (error) {
  console.error(
    "Farmer agricultural knowledge tool error:",
    error.message
  );

  toolResults.knowledge = "failed";

  knowledge = [];

  toolErrors.push({
    tool: "knowledge",
    message:
      "Agricultural knowledge is temporarily unavailable.",
  });
}

    
}
return {
  question: cleanQuestion,
  language,
  decision,
  toolsUsed,
  toolResults,
  safetyCheck,
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
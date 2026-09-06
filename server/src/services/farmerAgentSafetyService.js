const ALLOWED_TOOLS = [
  "crops",
  "diseaseAnalyses",
  "weather",
  "knowledge",
];

const MAX_TOOLS_PER_REQUEST = 4;

export const validateAgentDecision = (decision) => {
  if (!decision || typeof decision !== "object") {
    throw new Error("Invalid agent decision");
  }

  const selectedTools = [];

  if (decision.needsCrops) {
    selectedTools.push("crops");
  }

  if (decision.needsDiseaseAnalyses) {
    selectedTools.push("diseaseAnalyses");
  }

  if (decision.needsWeather) {
    selectedTools.push("weather");
  }

  if (decision.needsKnowledge) {
    selectedTools.push("knowledge");
  }

  const unauthorizedTools = selectedTools.filter(
    (tool) => !ALLOWED_TOOLS.includes(tool)
  );

  if (unauthorizedTools.length > 0) {
    throw new Error(
      `Unauthorized agent tools requested: ${unauthorizedTools.join(", ")}`
    );
  }

  if (selectedTools.length > MAX_TOOLS_PER_REQUEST) {
    throw new Error(
      "Agent requested too many tools for a single request"
    );
  }

  return {
    safe: true,
    selectedTools,
  };
};
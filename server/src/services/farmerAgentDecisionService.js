export const decideAgentNeeds = (question) => {
  if (!question || !question.trim()) {
    throw new Error("Question is required");
  }

  const text = question.toLowerCase().trim();

  // --------------------------------------------------
  // WEATHER
  // --------------------------------------------------
  const needsWeather =
    text.includes("weather") ||
    text.includes("rain") ||
    text.includes("temperature") ||
    text.includes("forecast") ||
    text.includes("humidity") ||
    text.includes("wind");

  // --------------------------------------------------
  // DISEASE ANALYSES
  // --------------------------------------------------
  const needsDiseaseAnalyses =
    text.includes("recent disease") ||
    text.includes("recent diseases") ||
    text.includes("what diseases were recently detected") ||
    text.includes("recent diagnosis") ||
    text.includes("recent diagnoses") ||
    text.includes("detected disease") ||
    text.includes("detected diseases") ||
    text.includes("disease analysis") ||
    text.includes("disease analyses") ||
    text.includes("my disease") ||
    text.includes("my diseases") ||
    text.includes("my diagnosis") ||
    text.includes("my diagnoses");

  // --------------------------------------------------
  // FARMER CROPS
  // --------------------------------------------------
  const needsCrops =
    text.includes("my crop") ||
    text.includes("my crops") ||
    text.includes("my tomato") ||
    text.includes("my tomatoes") ||
    text.includes("my farm") ||
    text.includes("my field") ||
    text.includes("what crops do i have") ||
    text.includes("which crops do i have") ||
    text.includes("what crop do i have") ||
    text.includes("which crop do i have");

  // --------------------------------------------------
  // AGRICULTURAL KNOWLEDGE
  // --------------------------------------------------
  const needsKnowledge =
    text.includes("symptom") ||
    text.includes("symptoms") ||
    text.includes("care") ||
    text.includes("prevent") ||
    text.includes("prevention") ||
    text.includes("irrigation") ||
    text.includes("water") ||
    text.includes("tomato") ||
    text.includes("early blight") ||
    text.includes("late blight") ||
    text.includes("how to treat") ||
    text.includes("treatment");

  // --------------------------------------------------
  // RESPONSE TYPE
  // --------------------------------------------------
  let responseType = "general";

  if (needsWeather) {
    responseType = "weather";
  } else if (needsDiseaseAnalyses) {
    responseType = "disease_history";
  } else if (needsCrops) {
    responseType = "crop_information";
  } else if (needsKnowledge) {
    responseType = "agricultural_knowledge";
  }

  // --------------------------------------------------
  // RETURN AGENT DECISION
  // --------------------------------------------------
  return {
    needsKnowledge,
    needsCrops,
    needsDiseaseAnalyses,
    needsWeather,
    responseType,
  };
};
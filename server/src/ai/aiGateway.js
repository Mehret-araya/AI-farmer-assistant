import cropDiseaseConfig from "../config/cropDiseaseConfig.js";

const normalizePrediction = (
  prediction = {},
  cropType
) => {
  const config = cropDiseaseConfig[cropType];

  if (!config) {
    return {
      disease: "Uncertain",
      confidence: 0,
      message: `Crop type "${cropType}" is not supported yet.`,
    };
  }

  const disease = config.diseases.includes(
    prediction.disease
  )
    ? prediction.disease
    : "Uncertain";

  const confidence = Number(prediction.confidence);

  return {
    disease,
    confidence:
      Number.isFinite(confidence) &&
      confidence >= 0 &&
      confidence <= 1
        ? confidence
        : 0,
    message:
      prediction.message ||
      "AI disease detection is not connected yet.",
  };
};

export const analyzeCropImage = async (
  imageUrl,
  cropType
) => {
  if (!imageUrl) {
    throw new Error("Image URL is required");
  }

  if (!cropType) {
    throw new Error("Crop type is required");
  }

  const normalizedCropType =
    cropType.toLowerCase().trim();

  const config =
    cropDiseaseConfig[normalizedCropType];

  if (!config) {
    return {
      disease: "Uncertain",
      confidence: 0,
      message:
        "This crop is not supported by the AI system yet.",
    };
  }

  if (!config.aiEnabled) {
    return {
      disease: "Uncertain",
      confidence: 0,
      message:
        `AI disease detection for ${normalizedCropType} is not available yet.`,
    };
  }

  // Temporary AI result.
  // The real model will be connected later.
  const prediction = {
    disease: "Uncertain",
    confidence: 0,
    message:
      "Tomato AI model is not connected yet.",
  };

  return normalizePrediction(
    prediction,
    normalizedCropType
  );
};
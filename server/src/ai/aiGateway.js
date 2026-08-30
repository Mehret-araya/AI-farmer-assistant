import cropDiseaseConfig from "../config/cropDiseaseConfig.js";

// AI Gateway
// Central entry point for all AI services.

const normalizePrediction = (prediction = {}, cropName) => {
  const cropConfig = cropDiseaseConfig[cropName];

  if (!cropConfig) {
    return {
      disease: "Uncertain",
      confidence: 0,
      message: "This crop is not currently supported.",
      recommendation:
        "Please select a supported crop.",
    };
  }

  const allowedDiseases = Object.keys(
    cropConfig.diseases
  );

  const disease = allowedDiseases.includes(
    prediction.disease
  )
    ? prediction.disease
    : "Uncertain";

  const confidence = Number(prediction.confidence);

  const normalizedConfidence =
    Number.isFinite(confidence) &&
    confidence >= 0 &&
    confidence <= 1
      ? confidence
      : 0;

  const diseaseInfo =
    cropConfig.diseases[disease] ||
    cropConfig.diseases.Uncertain;

  return {
    disease,
    confidence: normalizedConfidence,

    message:
      prediction.message ||
      diseaseInfo.explanation,

    recommendation:
      prediction.recommendation ||
      diseaseInfo.recommendation,

    severity: diseaseInfo.severity,
  };
};

export const analyzeCropImage = async (
  imageUrl,
  cropName
) => {
  if (!imageUrl) {
    throw new Error("Image URL is required");
  }

  if (!cropName) {
    throw new Error("Crop name is required");
  }

  /*
   * TEMPORARY AI PROVIDER
   *
   * The real computer-vision model will be connected later.
   */

  const prediction = {
    disease: "Uncertain",
    confidence: 0,
  };

  return normalizePrediction(
    prediction,
    cropName
  );
};
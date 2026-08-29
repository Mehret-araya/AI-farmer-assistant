// AI Gateway
// Central entry point for all AI services.
//
// The disease-analysis controller should communicate with the AI
// through this module instead of calling an AI provider directly.
//
// Later we can connect:
// 1. A real tomato disease classification model
// 2. An external computer-vision API
// 3. An LLM for explanation and recommendations
//
// Keeping this gateway separate makes the application easier to
// maintain and allows us to change AI providers later.

const ALLOWED_DISEASES = [
  "Healthy",
  "Early Blight",
  "Late Blight",
  "Uncertain",
];

const normalizePrediction = (prediction = {}) => {
  const disease = ALLOWED_DISEASES.includes(prediction.disease)
    ? prediction.disease
    : "Uncertain";

  const confidence = Number(prediction.confidence);

  return {
    disease,
    confidence:
      Number.isFinite(confidence) && confidence >= 0 && confidence <= 1
        ? confidence
        : 0,
    message:
      prediction.message ||
      "AI disease detection is not connected yet.",
  };
};

export const analyzeCropImage = async (imageUrl) => {
  if (!imageUrl) {
    throw new Error("Image URL is required");
  }

  /*
   * TEMPORARY AI PROVIDER
   *
   * This is intentionally a placeholder until we connect
   * the real tomato disease classification model.
   *
   * The rest of the application already communicates with
   * the AI through this function.
   */

  const prediction = {
    disease: "Uncertain",
    confidence: 0,
    message: "AI disease detection is not connected yet.",
  };

  return normalizePrediction(prediction);
};
import "dotenv/config";
import OpenAI from "openai";
import cropDiseaseConfig from "../config/cropDiseaseConfig.js";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MIN_CONFIDENCE = 0.5;

const normalizePrediction = (prediction = {}, cropName) => {
  const cropConfig = cropDiseaseConfig[cropName];

  if (!cropConfig) {
    return {
      disease: "Uncertain",
      confidence: 0,
      message: "This crop is not currently supported.",
      recommendation: "Please select a supported crop.",
      severity: "unknown",
    };
  }

  const allowedDiseases = Object.keys(cropConfig.diseases);

  const rawDisease = prediction.disease;

  const disease = allowedDiseases.includes(rawDisease)
    ? rawDisease
    : "Uncertain";

  const confidence = Number(prediction.confidence);

  const normalizedConfidence =
    Number.isFinite(confidence) &&
    confidence >= 0 &&
    confidence <= 1
      ? confidence
      : 0;

  // MVP rule:
  // Any prediction below 50% confidence is considered unreliable.
  if (
    disease !== "Uncertain" &&
    normalizedConfidence < MIN_CONFIDENCE
  ) {
    const uncertainInfo = cropConfig.diseases.Uncertain;

    return {
      disease: "Uncertain",
      confidence: normalizedConfidence,
      message:
        "The image does not provide enough visual evidence for a reliable disease assessment.",
      recommendation:
        uncertainInfo?.recommendation ||
        "Take a clearer photo showing the affected plant parts and try again.",
      severity: uncertainInfo?.severity || "unknown",
    };
  }

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

  const cropConfig = cropDiseaseConfig[cropName];

  if (!cropConfig || !cropConfig.aiEnabled) {
    return normalizePrediction(
      {
        disease: "Uncertain",
        confidence: 0,
      },
      cropName
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await client.responses.create({
    model:
      process.env.OPENAI_VISION_MODEL ||
      process.env.OPENAI_MODEL ||
      "gpt-5.6-luna",

    instructions: `
You are a careful agricultural crop-image analysis system.

Analyze the provided tomato plant image.

You may classify ONLY one of these conditions:

Healthy
Early Blight
Late Blight
Uncertain

Rules:
1. Return ONLY valid JSON.
2. Do not invent diseases outside the allowed list.
3. If the image is unclear, unrelated, or insufficient for reliable classification, return Uncertain.
4. Do not claim certainty when visual evidence is weak.
5. Confidence must be a number between 0 and 1.
6. If confidence is below 0.50, return Uncertain.
7. Keep the explanation concise and based only on visible evidence.
8. Recommendations must be conservative and practical.
9. Do not invent pesticide names, dosages, fertilizer rates, or unsupported treatments.
10. Do not diagnose from information that is not visible in the image.

JSON format:
{
  "disease": "Healthy | Early Blight | Late Blight | Uncertain",
  "confidence": 0.0,
  "message": "short explanation",
  "recommendation": "short practical recommendation"
}
`,

    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Analyze this tomato crop image. Crop: ${cropName}`,
          },
          {
            type: "input_image",
            image_url: imageUrl,
            detail: "high",
          },
        ],
      },
    ],
  });

  let prediction;

  try {
    prediction = JSON.parse(response.output_text);
  } catch (error) {
    console.error(
      "Invalid AI disease response:",
      response.output_text
    );

    prediction = {
      disease: "Uncertain",
      confidence: 0,
      message:
        "The image could not be classified reliably.",
      recommendation:
        "Take a clearer photo showing the affected plant parts and try again.",
    };
  }

  return normalizePrediction(
    prediction,
    cropName
  );
};
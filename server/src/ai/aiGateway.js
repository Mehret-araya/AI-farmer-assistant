import "dotenv/config";
import cropDiseaseConfig from "../config/cropDiseaseConfig.js";

const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL || "http://localhost:11434";

const OLLAMA_VISION_MODEL =
  process.env.OLLAMA_VISION_MODEL || "qwen2.5vl:3b";

const MIN_CONFIDENCE = 0.5;

const normalizeDiseaseLabel = (value, allowedDiseases) => {
  const normalizedValue = String(value || "")
    .trim()
    .toLowerCase();

  return allowedDiseases.find(
    (disease) => disease.toLowerCase() === normalizedValue
  ) || null;
};

/*
  Convert the AI prediction into the exact format
  expected by the application.
*/
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

  const disease =
    normalizeDiseaseLabel(
      prediction.disease,
      allowedDiseases
    ) || "Uncertain";

  const confidence = Number(prediction.confidence);

  const normalizedConfidence =
    Number.isFinite(confidence) &&
    confidence >= 0 &&
    confidence <= 1
      ? confidence
      : 0;

  /*
    If confidence is below 50%, do not present
    the result as a reliable diagnosis.
  */
  if (
    disease !== "Uncertain" &&
    normalizedConfidence < MIN_CONFIDENCE
  ) {
    const uncertainInfo =
      cropConfig.diseases.Uncertain;

    return {
      disease: "Uncertain",
      confidence: normalizedConfidence,
      message:
        "The image does not provide enough visual evidence for a reliable disease assessment.",
      recommendation:
        uncertainInfo?.recommendation ||
        "Take a clearer photo showing the affected plant parts and try again.",
      severity:
        uncertainInfo?.severity || "unknown",
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

/*
  Download the Cloudinary image and convert it
  into Base64 so Ollama can analyze it.
*/
const imageUrlToBase64 = async (imageUrl) => {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(
      `Unable to download crop image: ${response.status}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  return buffer.toString("base64");
};

/*
  Analyze a crop image using local Ollama + Qwen2.5-VL.
*/
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

  /*
    Download the image from Cloudinary.
  */
  const imageBase64 =
    await imageUrlToBase64(imageUrl);

  /*
    Send the image to Ollama.
  */
  const response = await fetch(
    `${OLLAMA_BASE_URL}/api/chat`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: OLLAMA_VISION_MODEL,

        messages: [
          {
            role: "user",

            content: `
Analyze this tomato plant image.

You may classify ONLY one of these conditions:

Healthy
Early Blight
Late Blight
Uncertain

Rules:

1. Return ONLY valid JSON.
2. Do not use any disease name outside the allowed list.
3. If the image is unclear, unrelated, or insufficient for reliable classification, return Uncertain.
4. Do not claim certainty when visual evidence is weak.
5. Confidence must be a number between 0 and 1.
6. If confidence is below 0.50, return Uncertain.
7. Base the explanation only on visible evidence.
8. Keep the explanation concise.
9. Recommendations must be conservative and practical.
10. Do not invent pesticide names, dosages, fertilizer rates, or unsupported treatments.
11. Do not diagnose from information that is not visible in the image.

Return exactly this JSON structure:

{
  "disease": "Healthy | Early Blight | Late Blight | Uncertain",
  "confidence": 0.0,
  "message": "short explanation based on visible evidence",
  "recommendation": "short practical recommendation"
}

Crop: ${cropName}
`,

            images: [imageBase64],
          },
        ],

        stream: false,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "Ollama API error:",
      errorText
    );

    throw new Error(
      `Ollama request failed: ${response.status}`
    );
  }

  const data = await response.json();

  const aiText =
    data?.message?.content || "";

  
  let prediction;

  const parseConfidence = (text) => {
    const confidenceMatch = text.match(
      /confidence\s*(?:is|:|=)?\s*(\d+(?:\.\d+)?)\s*(%|percent)?/i
    );

    if (!confidenceMatch) {
      return 0;
    }

    let confidence = Number(confidenceMatch[1]);

    if (
      confidenceMatch[2] === "%" ||
      confidence > 1
    ) {
      confidence /= 100;
    }

    return Number.isFinite(confidence)
      ? Math.max(0, Math.min(1, confidence))
      : 0;
  };

  const parseNaturalLanguagePrediction = (text) => {
    const lowerText = text.toLowerCase();
    const mentionsHealthy = /\bhealthy\b/.test(lowerText);
    const mentionsEarlyBlight = /\bearly\s+blight\b/.test(lowerText);
    const mentionsLateBlight = /\blate\s+blight\b/.test(lowerText);
    const deniesDisease =
      /\b(no|without|absence|not)\b[^.\n]{0,80}\b(signs?|symptoms?|evidence)\b/i.test(text);

    let disease = "Uncertain";

    if (mentionsEarlyBlight && !deniesDisease) {
      disease = "Early Blight";
    } else if (mentionsLateBlight && !deniesDisease) {
      disease = "Late Blight";
    } else if (mentionsHealthy) {
      disease = "Healthy";
    }

    return {
      disease,
      confidence: parseConfidence(text),
      message: text,
      recommendation:
        "Continue monitoring the plant for any signs of disease. If symptoms appear or the image is unclear, take a clearer photo and analyze it again.",
    };
  };

  try {
    // Remove possible Markdown code fences such as ```json ... ```
    const cleanedText = aiText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Parse strict JSON first, then recover an object wrapped in prose.
    try {
      prediction = JSON.parse(cleanedText);
    } catch {
      const jsonStart = cleanedText.indexOf("{");
      const jsonEnd = cleanedText.lastIndexOf("}");

      if (jsonStart < 0 || jsonEnd <= jsonStart) {
        throw new Error("No JSON object found");
      }

      prediction = JSON.parse(
        cleanedText.slice(jsonStart, jsonEnd + 1)
      );
    }
  } catch (error) {
    /*
      Qwen may sometimes return normal text instead of JSON.

      Example:
      "The tomato plant appears healthy.
       Confidence: 0.9
       Explanation: ..."
    */

    const text = aiText.trim();

    prediction = parseNaturalLanguagePrediction(text);
  }

  console.log("Ollama disease prediction:", {
    rawResponse: aiText,
    parsedDisease: prediction.disease,
    parsedConfidence: prediction.confidence,
  });

  const normalizedPrediction = normalizePrediction(
    prediction,
    cropName
  );

  console.log("Ollama normalized prediction:", {
    disease: normalizedPrediction.disease,
    confidence: normalizedPrediction.confidence,
  });

  return normalizedPrediction;
};
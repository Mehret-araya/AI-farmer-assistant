import { askAssistant } from "../ai/assistantClient.js";
import { getWeather } from "../services/weatherService.js";
import Crop from "../models/Crop.js";
import DiseaseAnalysis from "../models/DiseaseAnalysis.js";
import AgriculturalKnowledge from "../models/AgriculturalKnowledge.js";
import User from "../models/User.js";
export const askFarmerAssistant = async (req, res) => {
  try {
    const { question } = req.body;

const user = await User.findById(req.user.userId).select("language");

const language = user?.language || "en";
console.log("Assistant language:", language);


    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

        // Retrieve relevant agricultural knowledge
    

          // Retrieve relevant agricultural knowledge
const searchTerms = question
  .trim()
  .toLowerCase()
  .split(/\s+/)
  .filter(
    (word) =>
      word.length > 2 &&
      ![
        "what",
        "are",
        "the",
        "how",
        "can",
        "does",
        "about",
        "for",
        "tomato",
        "please",
        "tell",
        "me",
      ].includes(word)
  );

const knowledgeResults = await AgriculturalKnowledge.find({
  crop: "Tomato",
  language,
  $or: [
    ...searchTerms.map((term) => ({
      title: { $regex: term, $options: "i" },
    })),
    ...searchTerms.map((term) => ({
      content: { $regex: term, $options: "i" },
    })),
    ...searchTerms.map((term) => ({
      topic: { $regex: term, $options: "i" },
    })),
    ...searchTerms.map((term) => ({
      tags: { $regex: term, $options: "i" },
    })),
  ],
})
  .limit(5)
  .sort({ createdAt: -1 });

console.log("Search terms:", searchTerms);
console.log("Knowledge results:", knowledgeResults.length);

// Build knowledge context
const knowledgeContext =
  knowledgeResults.length > 0
    ? knowledgeResults
        .map(
          (knowledge) =>
            `Title: ${knowledge.title}
Topic: ${knowledge.topic}
Disease: ${knowledge.disease || "General"}
Content: ${knowledge.content}
Source: ${knowledge.source || "Not specified"}`
        )
        .join("\n\n")
    : "No relevant agricultural knowledge was found.";

    // Get the logged-in farmer's crops
   
    const crops = await Crop.find({
  userId: req.user.userId,
}).select(
  "name variety plantingDate growthStage location farmSize latitude longitude"
);
// Get weather for the farmer's first crop with coordinates
let weatherContext = "Weather information is not available.";

const cropWithCoordinates = crops.find(
  (crop) =>
    crop.latitude !== null &&
    crop.latitude !== undefined &&
    crop.longitude !== null &&
    crop.longitude !== undefined
);

if (cropWithCoordinates) {
  try {
    const weather = await getWeather(
      cropWithCoordinates.latitude,
      cropWithCoordinates.longitude
    );

    weatherContext = `
Current temperature: ${
      weather.current?.temperature_2m ?? "Not available"
    } °C

Relative humidity: ${
      weather.current?.relative_humidity_2m ?? "Not available"
    } %

Precipitation: ${
      weather.current?.precipitation ?? "Not available"
    } mm

Wind speed: ${
      weather.current?.wind_speed_10m ?? "Not available"
    } km/h

7-day precipitation probability:
${
  weather.daily?.precipitation_probability_max
    ? weather.daily.precipitation_probability_max.join(", ")
    : "Not available"
} %
`;
  } catch (weatherError) {
    console.error("Assistant weather error:", weatherError);
  }
}
    // Get the logged-in farmer's recent disease analyses
    const analyses = await DiseaseAnalysis.find({
      userId: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    // Build crop context
    const cropContext =
      crops.length > 0
        ? crops
            .map(
              (crop) =>
                `Crop: ${crop.name}, Variety: ${
                  crop.variety || "Not specified"
                }, Planting date: ${
                  crop.plantingDate
                    ? crop.plantingDate
                        .toISOString()
                        .split("T")[0]
                    : "Not specified"
                }, Growth stage: ${
                  crop.growthStage || "Not specified"
                }, Location: ${
                  crop.location || "Not specified"
                }, Farm size: ${
                  crop.farmSize ?? 0
                }`
            )
            .join("\n")
        : "The farmer has not added any crops yet.";

    // Build disease-analysis context
    const diseaseContext =
      analyses.length > 0
        ? analyses
            .map(
              (analysis) =>
                `Disease: ${
                  analysis.disease
                }, Confidence: ${
                  analysis.confidence
                }, Explanation: ${
                  analysis.explanation ||
                  "Not available"
                }, Recommendation: ${
                  analysis.recommendation ||
                  "Not available"
                }`
            )
            .join("\n")
        : "No previous disease analyses are available.";

    // Combine farmer context with the question
    const contextualQuestion = `
You are an agricultural assistant helping a farmer.

Relevant agricultural knowledge:
${knowledgeContext}

Farmer's crop information:
${cropContext}

Recent disease analysis information:
${diseaseContext}

Current farm weather:
${weatherContext}

Farmer's question:
${question.trim()}

Give practical and safe agricultural advice.

Use the farmer's crop information, disease-analysis
information, and weather information when relevant.

Do not invent facts about the farmer's farm.

If the available information is insufficient, clearly say
what additional information is needed.

If a disease analysis has low confidence or is "Uncertain",
do not present it as a confirmed diagnosis.
`;

    const answer = await askAssistant(contextualQuestion);

const sources = knowledgeResults.map((knowledge) => ({
  title: knowledge.title,
  source: knowledge.source,
  sourceUrl: knowledge.sourceUrl,
}));

return res.status(200).json({
  success: true,
  answer,
  sources,
});
  } catch (error) {
    console.error("Assistant error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get assistant response",
    });
  }
};
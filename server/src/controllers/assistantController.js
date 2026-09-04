import { askAssistant } from "../ai/assistantClient.js";
import { getWeather } from "../services/weatherService.js";
import Crop from "../models/Crop.js";
import DiseaseAnalysis from "../models/DiseaseAnalysis.js";
import AgriculturalKnowledge from "../models/AgriculturalKnowledge.js";
import User from "../models/User.js";
import { searchKnowledgeSemantically } from "../services/knowledgeRetrievalService.js";

export const askFarmerAssistant = async (req, res) => {
  try {
    const { question } = req.body;

    // Get the farmer's preferred language
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

const normalizedQuestion = question.trim().toLowerCase();

// Detect specific disease/topic mentioned in the question
let diseaseFilter = null;

if (normalizedQuestion.includes("early blight")) {
  diseaseFilter = "Early Blight";
} else if (normalizedQuestion.includes("late blight")) {
  diseaseFilter = "Late Blight";
} else if (normalizedQuestion.includes("uncertain")) {
  diseaseFilter = "Uncertain";
} else if (normalizedQuestion.includes("healthy")) {
  diseaseFilter = "Healthy";
}

const searchTerms = normalizedQuestion
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
        "should",
        "my",
        "have",
        "has",
        "with",
        "this",
        "that",
      ].includes(word)
  );

let knowledgeResults = [];

if (diseaseFilter) {
  // When a specific disease is mentioned,
  // prioritize the exact disease document.
  knowledgeResults = await AgriculturalKnowledge.find({
    crop: "Tomato",
    language,
    disease: diseaseFilter,
  })
    .limit(3)
    .sort({ createdAt: -1 });
} else if (searchTerms.length > 0) {
  // For general questions, use keyword-based retrieval.
  knowledgeResults = await AgriculturalKnowledge.find({
    crop: "Tomato",
    language,
    $or: searchTerms.flatMap((term) => [
      { title: { $regex: term, $options: "i" } },
      { content: { $regex: term, $options: "i" } },
      { topic: { $regex: term, $options: "i" } },
      { tags: { $regex: term, $options: "i" } },
    ]),
  })
    .limit(5)
    .sort({ createdAt: -1 });
}

console.log("Assistant language:", language);
console.log("Detected disease:", diseaseFilter);
console.log("Knowledge results:", knowledgeResults.length);

// Retrieve relevant agricultural knowledge using semantic search

const normalizedQuestion = question.trim().toLowerCase();

let diseaseFilter = null;

if (normalizedQuestion.includes("early blight")) {
  diseaseFilter = "Early Blight";
} else if (normalizedQuestion.includes("late blight")) {
  diseaseFilter = "Late Blight";
} else if (normalizedQuestion.includes("uncertain")) {
  diseaseFilter = "Uncertain";
} else if (normalizedQuestion.includes("healthy")) {
  diseaseFilter = "Healthy";
}

const knowledgeResults = await searchKnowledgeSemantically({
  question: question.trim(),
  language,
  disease: diseaseFilter,
  limit: 5,
});

console.log("Assistant language:", language);
console.log("Detected disease:", diseaseFilter);
console.log("Semantic knowledge results:", knowledgeResults.length);
console.log(
  "Knowledge titles:",
  knowledgeResults.map((knowledge) => knowledge.title)
);
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

    // Get the farmer's crops
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
                    ? crop.plantingDate.toISOString().split("T")[0]
                    : "Not specified"
                }, Growth stage: ${
                  crop.growthStage || "Not specified"
                }, Location: ${
                  crop.location || "Not specified"
                }, Farm size: ${crop.farmSize ?? 0}`
            )
            .join("\n")
        : "The farmer has not added any crops yet.";

    // Build disease-analysis context
    const diseaseContext =
      analyses.length > 0
        ? analyses
            .map(
              (analysis) =>
                `Disease: ${analysis.disease}, Confidence: ${
                  analysis.confidence
                }, Explanation: ${
                  analysis.explanation || "Not available"
                }, Recommendation: ${
                  analysis.recommendation || "Not available"
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

Answer the farmer in their preferred language.

The farmer's preferred language code is:

${language}

Language codes:

en = English
am = Amharic
sw = Swahili
hi = Hindi
es = Spanish

Do not answer in English when the farmer's preferred language is another supported language.

Farmer's question:

${question.trim()}

Give practical and safe agricultural advice.

Use the relevant agricultural knowledge as a trusted reference.

Use the farmer's crop information, disease-analysis information,
and weather information only when relevant to the farmer's question.

Do not invent facts about the farmer's farm.
Use only the retrieved agricultural knowledge for disease symptoms,
prevention, and treatment advice.

Do not add disease facts that are not supported by the retrieved
agricultural knowledge.

Do not invent medications, pesticides, fertilizers, treatments,
dosages, or application instructions.

Never claim that a disease is definitely diagnosed unless a verified
disease analysis explicitly confirms it.

If the available information does not support a treatment or
recommendation, say that the available information is insufficient.

Do not tell the farmer to see a human doctor for a crop problem.
If professional agricultural help is needed, recommend a qualified
agricultural professional or agricultural extension worker.

Answer primarily in the farmer's selected language.
Do not unnecessarily repeat the answer in English.

Do not assume that the farmer's crops are healthy unless the
farmer's information or a disease analysis explicitly states this.

If the available information is insufficient, clearly say
what additional information is needed.

If a disease analysis has low confidence or is "Uncertain",
do not present it as a confirmed diagnosis.

Only use disease information that is relevant to the farmer's question.

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
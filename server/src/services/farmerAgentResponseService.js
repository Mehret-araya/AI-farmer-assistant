export const buildFarmerAgentContext = (agentResult) => {
  const {
    knowledge = [],
    crops = [],
    diseaseAnalyses = [],
    weather = null,
  } = agentResult;

  // The response type is part of the agent decision.
  const responseType =
    agentResult.decision?.responseType || "general";

  // --------------------------------------------------
  // AGRICULTURAL KNOWLEDGE CONTEXT
  // --------------------------------------------------
  const knowledgeContext =
    knowledge.length > 0
      ? knowledge
          .map(
            (item) =>
              `Title: ${item.title}
Topic: ${item.topic}
Disease: ${item.disease || "General"}
Content: ${item.content}
Source: ${item.source || "Not specified"}`
          )
          .join("\n\n")
      : "No relevant agricultural knowledge was found.";

  // --------------------------------------------------
  // FARMER CROP CONTEXT
  // --------------------------------------------------
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

  // --------------------------------------------------
  // DISEASE ANALYSIS CONTEXT
  // --------------------------------------------------
  const diseaseContext =
    diseaseAnalyses.length > 0
      ? diseaseAnalyses
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

  // --------------------------------------------------
  // WEATHER CONTEXT
  // --------------------------------------------------
  let weatherContext = "Weather information is not available.";

  if (weather) {
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
  }

  // --------------------------------------------------
  // RESPONSE INSTRUCTIONS
  // --------------------------------------------------
  let responseInstruction =
    "Provide a general agricultural answer using only the information relevant to the farmer's question.";

  switch (responseType) {
    case "crop_information":
      responseInstruction =
        "Focus primarily on the farmer's registered crop information. Do not invent crops or farm details.";
      break;

    case "weather":
      responseInstruction =
        "Focus primarily on the farmer's farm weather information. Explain the available weather information only when relevant to the farmer's question.";
      break;

    case "agricultural_knowledge":
      responseInstruction =
        "Focus primarily on the retrieved agricultural knowledge. Use the retrieved knowledge as the trusted reference for agricultural facts, especially disease symptoms, prevention, and treatment.";
      break;

    case "disease_history":
      responseInstruction =
        "Focus primarily on the farmer's previous disease analyses. Clearly distinguish between confirmed, uncertain, and low-confidence analyses.";
      break;

    case "general":
    default:
      responseInstruction =
        "Provide a general agricultural answer using only the information relevant to the farmer's question.";
      break;
  }

  return {
    responseType,
    responseInstruction,
    knowledgeContext,
    cropContext,
    diseaseContext,
    weatherContext,
  };
};
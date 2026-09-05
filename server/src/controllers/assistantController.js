import { askAssistant } from "../ai/assistantClient.js";
import User from "../models/User.js";
import { runFarmerAgent } from "../services/farmerAgentService.js";
import { buildFarmerAgentContext } from "../services/farmerAgentResponseService.js";

export const askFarmerAssistant = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Get the farmer's preferred language.
    const user = await User.findById(req.user.userId).select(
      "language"
    );

    const language = user?.language || "en";

    console.log("Assistant language:", language);

    // Let the farmer agent decide which information is needed.
    const agentResult = await runFarmerAgent({
      userId: req.user.userId,
      question: question.trim(),
      language,
    });

    console.log("Agent decision:", agentResult.decision);

    // Build the response context selected by the agent.
    const {
      responseType,
      responseInstruction,
      knowledgeContext,
      cropContext,
      diseaseContext,
      weatherContext,
    } = buildFarmerAgentContext(agentResult);

    console.log("Agent response type:", responseType);

    // Send the selected context and response instruction
    // to the existing AI response generator.
    const contextualQuestion = `
You are an agricultural assistant helping a farmer.

The farmer agent has analyzed the question and selected the
following response type:

${responseType}

Response priority:

${responseInstruction}

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

Follow the response priority selected by the farmer agent.

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

Do not allow the response type to override the safety rules above.
`;

    const answer = await askAssistant(contextualQuestion);

    // Return the agricultural knowledge sources used by the agent.
    const sources = agentResult.knowledge.map((knowledge) => ({
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

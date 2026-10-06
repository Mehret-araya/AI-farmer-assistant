import { askAssistant } from "../ai/assistantClient.js";
import { runFarmerAgent } from "../services/farmerAgentService.js";
import { buildFarmerAgentContext } from "../services/farmerAgentResponseService.js";

export const askFarmerAssistant = async (req, res) => {
  try {
    const { question } = req.body;
    console.log("[assistant-debug] req.body.question:", question);

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Authentication middleware loads the current user's saved preferences.
    const supportedLanguages = new Set(["en", "am", "sw", "hi", "es"]);
    const language = supportedLanguages.has(req.user?.language)
      ? req.user.language
      : "en";

    console.log("[assistant-debug] req.user.language:", req.user?.language);
    console.log("[assistant-debug] effective language:", language);

    // Let the farmer agent decide which information is needed.
    const agentResult = await runFarmerAgent({
      userId: req.user._id,
      question: question.trim(),
      language,
    });

    console.log("[assistant-debug] detected crop/disease/intent:", {
      question: question.trim(),
      cropTerms: question.includes(String.fromCodePoint(0x1272, 0x121b, 0x1272, 0x121d)) ? ["Tomato"] : [],
      diseaseTerms: question.includes(String.fromCodePoint(0x1265, 0x120b, 0x12ed, 0x1275)) ? ["Early Blight"] : [],
      intent: agentResult.decision,
    });
    console.log("[assistant-debug] retrieved knowledge count/titles:", {
      count: agentResult.knowledge.length,
      titles: agentResult.knowledge.map((item) => item.title),
    });

    // Build the response context selected by the agent.
    const {
      responseType,
      responseInstruction,
      knowledgeContext,
      cropContext,
      diseaseContext,
      weatherContext,
      toolErrorContext,
      executionStatus,
      toolsUsedContext,
      toolResultsContext,
      reasoningContext,
    } = buildFarmerAgentContext(agentResult);

    console.log("[assistant-debug] final context passed to assistant:",
      JSON.stringify({
        responseType,
        responseInstruction,
        retrievedAgriculturalKnowledge: knowledgeContext,
        farmerCropInformation: cropContext,
        diseaseAnalysisInformation: diseaseContext,
        weatherInformation: weatherContext,
        executionStatus,
        toolsUsed: toolsUsedContext,
        toolResults: toolResultsContext,
        toolErrors: toolErrorContext,
        reasoning: reasoningContext,
      }, null, 2)
    );

    // Send the selected context and response instruction
    // to the existing AI response generator.
    const assistantContext = {
      responseType,
      responseInstruction,
      retrievedAgriculturalKnowledge: knowledgeContext,
      farmerCropInformation: cropContext,
      diseaseAnalysisInformation: diseaseContext,
      weatherInformation: weatherContext,
      executionStatus,
      toolsUsed: toolsUsedContext,
      toolResults: toolResultsContext,
      toolErrors: toolErrorContext,
      reasoning: reasoningContext,
    };

    const answer = await askAssistant(
      question.trim(),
      assistantContext,
      language,
      agentResult.knowledge
    );

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


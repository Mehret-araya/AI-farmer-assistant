import { askAssistant } from "../ai/assistantClient.js";

export const askFarmerAssistant = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const answer = await askAssistant(question);

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("Assistant error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get assistant response",
    });
  }
};
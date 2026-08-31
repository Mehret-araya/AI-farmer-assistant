import ollama from "ollama";

const MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";

export const askAssistant = async (question) => {
  if (!question || !question.trim()) {
    throw new Error("Question is required");
  }

  const response = await ollama.chat({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are an agricultural assistant for real farmers. Give clear, practical, safe, and easy-to-understand agricultural advice. Do not invent facts. If you are uncertain, clearly say so. Consider that farmers may have limited resources.",
      },
      {
        role: "user",
        content: question.trim(),
      },
    ],
  });

  return response.message?.content || "";
};
const API_URL = "http://localhost:5000";

export const askAssistant = async (question, token) => {
  if (!question || !question.trim()) {
    throw new Error("Question is required.");
  }

  if (!token) {
    throw new Error("Authentication token is required.");
  }

  const response = await fetch(`${API_URL}/assistant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      question: question.trim(),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get AI assistant response."
    );
  }

  return data;
};
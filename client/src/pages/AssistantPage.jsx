import { useState } from "react";
import { askAssistant } from "../api/assistant";

function AssistantPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setAnswer("");
    setError("");

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in.");
      return;
    }

    setLoading(true);

    try {
      const data = await askAssistant(question, token);

      setAnswer(data.answer);
      setQuestion("");
    } catch (err) {
      setError(
        err.message || "Failed to get AI assistant response."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="mx-auto max-w-3xl">

        <h1 className="text-4xl font-bold text-green-700">
          AI Farmer Assistant 🤖🌱
        </h1>

        <p className="mt-2 text-gray-700">
          Ask questions about your crops, farming, pests, and
          plant health.
        </p>

        <div className="mt-8 rounded-lg bg-white p-6 shadow">

          <form onSubmit={handleSubmit}>

            <label
              htmlFor="question"
              className="font-semibold text-gray-700"
            >
              Your Question
            </label>

            <textarea
              id="question"
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              placeholder="e.g. What should I do if my tomato leaves are turning yellow?"
              rows="5"
              className="mt-2 w-full rounded-lg border p-3"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-4 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading
                ? "Thinking..."
                : "Ask Assistant"}
            </button>

          </form>

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {answer && (
            <div className="mt-8 rounded-lg bg-green-50 p-6">

              <h2 className="text-2xl font-bold text-green-700">
                Assistant Response
              </h2>

              <p className="mt-4 whitespace-pre-wrap text-gray-800">
                {answer}
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AssistantPage;
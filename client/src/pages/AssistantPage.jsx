
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
    <div
      className="page-view assistant-page min-h-screen w-full bg-[#050A08] px-4 py-8 text-[#86EFAC] sm:px-6 lg:px-8"
      style={{
        minHeight: "100vh",
        backgroundColor: "#050A08",
        color: "#86EFAC",
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(0,255,136,0.10), transparent 35%), radial-gradient(circle at 0% 60%, rgba(34,197,94,0.05), transparent 30%), radial-gradient(circle at 100% 80%, rgba(0,255,136,0.05), transparent 30%)",
      }}
    >
      <div className="relative mx-auto w-full max-w-3xl">

        <div className="mb-8">
          <div className="mb-4 inline-flex items-center rounded-full border border-[#00FF88]/25 bg-[#0F1A14] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#4ADE80] shadow-[0_0_20px_rgba(0,255,136,0.08)]">
            AI Farming Intelligence
          </div>

          <h1
            className="font-sans text-3xl font-extrabold uppercase tracking-[0.12em] text-[#166534] drop-shadow-[0_0_18px_rgba(22,101,52,0.50)] sm:text-4xl"
            style={{
              color: "#166534",
              fontFamily: "Inter, Arial, sans-serif",
            }}
          >
            AI Farmer Assistant 🤖🌱
          </h1>

          <p
            className="mt-3 max-w-2xl text-sm leading-7 text-[#86EFAC] sm:text-base"
            style={{ color: "rgba(134,239,172,0.80)" }}
          >
            Ask questions about your crops, farming, pests, and plant health.
          </p>
        </div>

        <div
          className="rounded-[20px] border border-[#00FF88]/25 bg-[#0F1A14] p-5 shadow-[0_0_45px_rgba(0,255,136,0.10)] sm:p-7"
          style={{
            backgroundColor: "#0F1A14",
            borderColor: "rgba(0,255,136,0.25)",
          }}
        >
          <form onSubmit={handleSubmit}>

            <label
              htmlFor="question"
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#4ADE80]"
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
              className="mt-3 w-full resize-y rounded-2xl border border-[#00FF88]/30 bg-[#0F1A14] p-4 text-sm leading-7 text-[#166534] caret-[#166534] outline-none transition placeholder:text-[#4ADE80]/50 focus:border-[#00FF88] focus:ring-2 focus:ring-[#00FF88]/20 focus:shadow-[0_0_30px_rgba(0,255,136,0.18)] sm:text-base"
              style={{
                backgroundColor: "#0F1A14",
                color: "#166534",
                borderColor: "rgba(0,255,136,0.30)",
              }}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-5 rounded-full bg-[#166534] px-7 py-3 font-bold text-white shadow-[0_0_30px_rgba(22,101,52,0.40)] transition duration-200 hover:bg-[#15803D] hover:shadow-[0_0_42px_rgba(22,101,52,0.55)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              style={{
                backgroundColor: "#166534",
                color: "#FFFFFF",
              }}
            >
              {loading
                ? "Thinking..."
                : "Ask Assistant"}
            </button>

          </form>

          {error && (
            <div
              className="mt-6 rounded-2xl border border-red-400/25 bg-[#160B0B] p-4 text-sm leading-6 text-red-300"
              style={{
                backgroundColor: "#160B0B",
              }}
            >
              {error}
            </div>
          )}

          {answer && (
            <div
              className="mt-8 rounded-2xl border border-[#00FF88]/25 bg-[#050A08] p-5 shadow-[0_0_30px_rgba(0,255,136,0.10)] sm:p-6"
              style={{
                backgroundColor: "#050A08",
                borderColor: "rgba(0,255,136,0.25)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#00FF88] shadow-[0_0_14px_rgba(0,255,136,0.85)]" />

                <h2
                  className="font-sans text-lg font-extrabold uppercase tracking-[0.12em] text-[#00FF88] drop-shadow-[0_0_10px_rgba(0,255,136,0.30)] sm:text-xl"
                  style={{
                    color: "#00FF88",
                    fontFamily: "Inter, Arial, sans-serif",
                  }}
                >
                  Assistant Response
                </h2>
              </div>

              <p
                className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[#86EFAC] sm:text-base"
                style={{ color: "#D4E4DA" }}
              >
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


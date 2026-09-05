import { useRef, useState } from "react";

const API_URL = "http://localhost:5000";

const getSpeechRecognition = () => {
  return (
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    null
  );
};

const languageMap = {
  en: "en-US",
  am: "am-ET",
  sw: "sw-KE",
  hi: "hi-IN",
  es: "es-ES",
};

const VoiceAssistant = ({ language = "en" }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef(null);

  const speakAnswer = (text) => {
    if (!text || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = languageMap[language] || "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const askAssistant = async (question) => {
    try {
      setIsLoading(true);
      setError("");
      setAnswer("");

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(`${API_URL}/assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to get assistant response"
        );
      }

      const assistantAnswer = data.answer || "";

      setAnswer(assistantAnswer);

      if (assistantAnswer) {
        speakAnswer(assistantAnswer);
      }
    } catch (error) {
      console.error("Voice assistant error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    setError("");

    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = languageMap[language] || "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setAnswer("");

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;

      setTranscript(text);

      await askAssistant(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      setError(
        "Unable to recognize speech. Please try again."
      );

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsListening(false);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        disabled={isLoading}
        className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isListening
          ? "Stop Listening"
          : "🎤 Start Speaking"}
      </button>

      {isListening && (
        <p className="mt-3 text-gray-600">
          Listening...
        </p>
      )}

      {transcript && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <strong>You said:</strong>
          <p className="mt-1 text-gray-700">
            {transcript}
          </p>
        </div>
      )}

      {isLoading && (
        <p className="mt-4 text-gray-600">
          Thinking...
        </p>
      )}

      {answer && (
        <div className="mt-4 rounded-lg bg-green-50 p-4">
          <strong className="text-green-700">
            Assistant:
          </strong>

          <p className="mt-2 text-gray-700">
            {answer}
          </p>

          {isSpeaking && (
            <p className="mt-3 text-gray-600">
              🔊 Speaking...
            </p>
          )}

          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="mt-3 rounded-lg bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700"
            >
              Stop Speaking
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </p>
      )}
    </div>
  );
};

export default VoiceAssistant;
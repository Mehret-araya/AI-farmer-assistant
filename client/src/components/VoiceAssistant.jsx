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

  const recognitionRef = useRef(null);

  const askAssistant = async (question) => {
    try {
      setIsLoading(true);
      setError("");
      setAnswer("");

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

      setAnswer(data.answer || "");
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
    };

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;

      setTranscript(text);

      await askAssistant(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError("Unable to recognize speech. Please try again.");
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

  return (
    <div>
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        disabled={isLoading}
      >
        {isListening ? "Stop Listening" : "🎤 Start Speaking"}
      </button>

      {isListening && <p>Listening...</p>}

      {transcript && (
        <p>
          <strong>You said:</strong> {transcript}
        </p>
      )}

      {isLoading && <p>Thinking...</p>}

      {answer && (
        <div>
          <strong>Assistant:</strong>
          <p>{answer}</p>
        </div>
      )}

      {error && <p>{error}</p>}
    </div>
  );
};

export default VoiceAssistant;
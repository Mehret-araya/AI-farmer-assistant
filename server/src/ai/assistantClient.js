import "dotenv/config";

const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL || "http://localhost:11434";

const OLLAMA_TEXT_MODEL =
  process.env.OLLAMA_TEXT_MODEL || "llama3.2:3b";
const OLLAMA_TRANSLATION_MODEL =
  process.env.OLLAMA_TRANSLATION_MODEL || "qwen3.5:9b";

const languageInstructions = {
  en: "Write in natural, clear English.",
  am: "Translate into natural, readable Amharic using Ethiopic (Ge'ez) script.",
  sw: "Translate into natural, readable Swahili.",
  hi: "Translate into natural, readable Hindi using Devanagari script.",
  es: "Translate into natural, readable Spanish.",
};

const supportedLanguages = new Set(Object.keys(languageInstructions));

const symptomQuestion = /symptom|signs?|ምልክት|ምልክቶ|dalili|लक्षण|síntom|signos/i;
const symptomSentencePatterns = {
  en: /symptom|signs?/i,
  am: /ምልክቶ/i,
  sw: /dalili/i,
  hi: /लक्षण/i,
  es: /síntom|signos/i,
};

export const answerFromLocalizedKnowledge = ({
  question,
  knowledge = [],
  language,
}) => {
  if (!supportedLanguages.has(language) || language === "en") return null;

  const source = knowledge.find(
    (item) => item.language === language && item.content?.trim()
  );
  if (!source) return null;

  const sentences = source.content
    .trim()
    .split(/(?<=[.!?።।])\s+/u)
    .filter(Boolean);

  if (symptomQuestion.test(question)) {
    const firstSymptomSentence = sentences.findIndex((sentence) =>
      symptomSentencePatterns[language].test(sentence)
    );
    if (firstSymptomSentence >= 0) {
      return sentences
        .slice(firstSymptomSentence, firstSymptomSentence + 2)
        .join(" ");
    }
  }

  return source.content.trim();
};

const ollamaChat = async (messages, model = OLLAMA_TEXT_MODEL) => {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      think: false,
      options: {
        temperature: 0.1,
        repeat_penalty: 1.1,
        num_ctx: 8192,
        num_predict: 180,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Ollama assistant error:", errorText);
    throw new Error(`Ollama assistant request failed: ${response.status}`);
  }

  const data = await response.json();
  const answer = data?.message?.content?.trim();
  if (!answer) {
    throw new Error("Ollama returned an empty assistant response");
  }
  return answer;
};

export const askAssistant = async (
  question,
  context,
  language = "en",
  knowledge = []
) => {
  if (!question?.trim()) {
    throw new Error("Question is required");
  }

  const responseLanguage = supportedLanguages.has(language) ? language : "en";
  const localizedKnowledgeAnswer = answerFromLocalizedKnowledge({
    question,
    knowledge,
    language: responseLanguage,
  });
  if (localizedKnowledgeAnswer) return localizedKnowledgeAnswer;

  const factualDraft = await ollamaChat([
    {
      role: "system",
      content: `You are an agricultural answer generator. Write a concise answer in English using only facts supported by the supplied agent context. The retrieved agricultural knowledge is the factual source for agricultural claims; farmer records and weather may only support their own stated details. Do not add disease symptoms, causes, prevention, treatments, fertilizers, pesticides, dosages, or application directions absent from the context. If the context is insufficient, say what is missing. Do not treat uncertain or low-confidence analysis as confirmed. Do not invent farm facts. If agent execution was partial, do not imply missing information was retrieved. Never advise a farmer to see a human doctor; when needed, recommend a qualified agricultural professional or extension worker.`,
    },
    {
      role: "user",
      content: `Farmer question:\n${question.trim()}\n\nAgent evidence (JSON):\n${JSON.stringify(context || {})}`,
    },
  ]);

  if (responseLanguage === "en") return factualDraft;

  return ollamaChat([
    {
      role: "system",
      content: `Translate the supplied agricultural answer into ${responseLanguage}. ${languageInstructions[responseLanguage]} Preserve its meaning and every limitation exactly. Do not answer the original question independently, add or remove any factual claim, recommendation, symptom, treatment, product, dosage, or caveat, or repeat the answer. Output only the translation.`,
    },
    { role: "user", content: factualDraft },
  ], OLLAMA_TRANSLATION_MODEL);
};

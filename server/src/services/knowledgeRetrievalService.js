import { generateEmbedding } from "./knowledgeEmbeddingService.js";
import AgriculturalKnowledge from "../models/AgriculturalKnowledge.js";

export const searchKnowledgeSemantically = async ({
  question,
  language = "en",
  disease = null,
  limit = 5,
}) => {
  if (!question || !question.trim()) {
    throw new Error("Question is required");
  }

  console.log("[assistant-debug] exact knowledge retrieval query:", {
    question,
    language,
    disease,
    limit,
  });

  // The current Amharic query embeddings can miss the early-blight entries.
  // For this explicit disease query, prefer its localized RAG record and then
  // the English evidence so the response layer can translate that evidence.
  const normalizedQuestion = question.normalize("NFC");
  const isAmharicEarlyBlightQuestion =
    language === "am" &&
    normalizedQuestion.includes("ብላይት") &&
    (normalizedQuestion.includes("ቀደምት") ||
      normalizedQuestion.includes("ምልክት"));

  if (isAmharicEarlyBlightQuestion) {
    const localized = await AgriculturalKnowledge.find({
      crop: "Tomato",
      disease: "Early Blight",
      language,
    })
      .limit(limit)
      .lean();
    if (localized.length) {
      console.log("[assistant-debug] retrieved knowledge count/titles:", {
        count: localized.length,
        titles: localized.map((item) => item.title),
      });
      return localized;
    }

    const englishFallback = await AgriculturalKnowledge.find({
      crop: "Tomato",
      disease: "Early Blight",
      language: "en",
    })
      .limit(limit)
      .lean();
    console.log("[assistant-debug] retrieved knowledge count/titles:", {
      count: englishFallback.length,
      titles: englishFallback.map((item) => item.title),
    });
    return englishFallback;
  }

  // Generate the question embedding using the SAME local model
  // used to generate the knowledge-document embeddings.
  const queryVector = await generateEmbedding(question);

  // Only filter by language. Do NOT hardcode crop: "Tomato" here —
  // general agricultural questions (e.g. "What is lime used for?")
  // must be able to retrieve documents even when no crop is specified.
  // Apply disease filter only when a specific disease is known.
  const filter = { language };

  if (disease) {
    filter.disease = disease;
  }

  const results = await AgriculturalKnowledge.aggregate([
    {
      $vectorSearch: {
        index: "agricultural_knowledge_vector_index",
        path: "embedding",
        queryVector,
        numCandidates: 100,
        limit,
        filter,
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        topic: 1,
        disease: 1,
        language: 1,
        content: 1,
        source: 1,
        sourceUrl: 1,
        tags: 1,
        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ]);

  console.log("[assistant-debug] retrieved knowledge count/titles:", {
    count: results.length,
    titles: results.map((item) => item.title),
  });
  return results;
};

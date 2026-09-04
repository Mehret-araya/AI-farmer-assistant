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

  // Generate the question embedding using the SAME local model
  // used to generate the knowledge-document embeddings.
  const queryVector = await generateEmbedding(question);

  const filter = {
    language,
    crop: "Tomato",
  };

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

  return results;
};
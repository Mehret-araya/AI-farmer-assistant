import dotenv from "dotenv";
import connectDB from "../config/database.js";
import AgriculturalKnowledge from "../models/AgriculturalKnowledge.js";
import { generateEmbedding } from "../services/knowledgeEmbeddingService.js";

dotenv.config();

const generateKnowledgeEmbeddings = async () => {
  try {
    await connectDB();

    const knowledgeDocuments = await AgriculturalKnowledge.find({});

    console.log(
      `Found ${knowledgeDocuments.length} knowledge documents.`
    );

    let successful = 0;

    for (const knowledge of knowledgeDocuments) {
      const text = `
Title: ${knowledge.title}
Topic: ${knowledge.topic}
Disease: ${knowledge.disease || "General"}
Language: ${knowledge.language}
Content: ${knowledge.content}
Tags: ${knowledge.tags.join(", ")}
      `.trim();

      try {
        const embedding = await generateEmbedding(text);

        knowledge.embedding = embedding;

        await knowledge.save();

        successful++;

        console.log(
          `✓ ${successful}/${knowledgeDocuments.length} - ${knowledge.title}`
        );
      } catch (error) {
        console.error(
          `✗ Failed: ${knowledge.title}`,
          error.message
        );
      }
    }

    console.log(
      `Finished. Successfully generated ${successful} embeddings.`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Embedding generation error:",
      error.message
    );

    process.exit(1);
  }
};

generateKnowledgeEmbeddings();
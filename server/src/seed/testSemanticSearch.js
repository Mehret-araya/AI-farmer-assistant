import dotenv from "dotenv";
import connectDB from "../config/database.js";
import { searchKnowledgeSemantically } from "../services/knowledgeRetrievalService.js";

dotenv.config();

const testSemanticSearch = async () => {
  try {
    await connectDB();

    const results = await searchKnowledgeSemantically({
      question: "What are the signs of tomato early blight?",
      language: "en",
      limit: 3,
    });

    console.log("\nSemantic Search Results:");
    console.log("Count:", results.length);

    results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.title}`);
      console.log("Disease:", result.disease);
      console.log("Language:", result.language);
      console.log("Score:", result.score);
    });

    process.exit(0);
  } catch (error) {
    console.error("Semantic search error:", error.message);
    process.exit(1);
  }
};

testSemanticSearch();
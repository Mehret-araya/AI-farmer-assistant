import dotenv from "dotenv";
import connectDB from "../config/database.js";
import AgriculturalKnowledge from "../models/AgriculturalKnowledge.js";

dotenv.config();

const checkDimension = async () => {
  try {
    await connectDB();

    const knowledge = await AgriculturalKnowledge.findOne({
      embedding: { $exists: true, $ne: [] },
    });

    if (!knowledge) {
      console.log("No embedding found.");
      process.exit(1);
    }

    console.log("Embedding dimensions:", knowledge.embedding.length);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

checkDimension();
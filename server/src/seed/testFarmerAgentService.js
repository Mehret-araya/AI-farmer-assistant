import dotenv from "dotenv";
import connectDB from "../config/database.js";
import { runFarmerAgent } from "../services/farmerAgentService.js";

dotenv.config();

const runTest = async () => {
  try {
    await connectDB();

    const userId = "6a9a82169c55bdf7844343ef";

    const questions = [
      {
        question: "What are the symptoms of early blight in tomato?",
        language: "en",
      },
      {
        question: "What is the weather for my farm?",
        language: "en",
      },
      {
        question: "What diseases were recently detected?",
        language: "en",
      },
      {
        question: "How should I care for my tomato crop?",
        language: "en",
      },
    ];

    for (const item of questions) {
      console.log("\n========================================");
      console.log("QUESTION:", item.question);
      console.log("========================================");

      const result = await runFarmerAgent({
        userId,
        question: item.question,
        language: item.language,
      });

      console.log("\nDecision:");
      console.log(result.decision);

      console.log("\nCrops loaded:", result.crops.length);
      console.log(
        "Disease analyses loaded:",
        result.diseaseAnalyses.length
      );
      console.log(
        "Weather loaded:",
        result.weather !== null
      );
      console.log(
        "Knowledge results:",
        result.knowledge.length
      );
    }

    console.log(
      "\nFarmer agent decision integration test completed successfully."
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "\nFarmer agent decision integration test failed:",
      error
    );

    process.exit(1);
  }
};

runTest();
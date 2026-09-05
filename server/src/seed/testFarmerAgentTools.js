import dotenv from "dotenv";
import connectDB from "../config/database.js";
import {
  getFarmerCrops,
  getFarmerDiseaseAnalyses,
  getFarmerWeather,
  getAgriculturalKnowledge,
} from "../services/farmerAgentTools.js";

dotenv.config();

const runTest = async () => {
  try {
    await connectDB();

    // Replace this with the MongoDB _id of your own test user.
    const userId = "6a9a82169c55bdf7844343ef";

    console.log("\n--- FARMER CROPS ---");

    const crops = await getFarmerCrops(userId);
    console.log(crops);

    console.log("\n--- DISEASE ANALYSES ---");

    const analyses = await getFarmerDiseaseAnalyses(userId);
    console.log(analyses);

    console.log("\n--- FARMER WEATHER ---");

    const weather = await getFarmerWeather(userId);
    console.log(weather);

    console.log("\n--- AGRICULTURAL KNOWLEDGE ---");

    const knowledge = await getAgriculturalKnowledge({
      question: "What are the symptoms of early blight in tomato?",
      language: "en",
      disease: "Early Blight",
    });

    console.log(knowledge);

    console.log("\nAll agent tool tests completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("\nAgent tool test failed:", error);
    process.exit(1);
  }
};

runTest();
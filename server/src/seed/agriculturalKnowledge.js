import dotenv from "dotenv";
import connectDB from "../config/database.js";
import AgriculturalKnowledge from "../models/AgriculturalKnowledge.js";

dotenv.config({ path: "server/.env" });


const knowledgeData = [
  {
    crop: "Tomato",
    topic: "disease",
    disease: "Early Blight",
    language: "en",
    title: "Tomato Early Blight",
    content:
      "Early blight is a fungal disease that commonly affects tomato plants. Symptoms often begin as small dark spots on older leaves. The spots can develop into larger brown lesions with concentric rings. Severely affected leaves may turn yellow and fall from the plant. Good field sanitation, removing infected leaves, avoiding unnecessary leaf wetness, and maintaining good spacing between plants can help reduce disease spread.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "tomato",
      "early blight",
      "disease",
      "symptoms",
      "prevention",
    ],
  },

  {
    crop: "Tomato",
    topic: "disease",
    disease: "Late Blight",
    language: "en",
    title: "Tomato Late Blight",
    content:
      "Late blight is a serious disease that can affect tomato plants under cool and humid conditions. Symptoms may include irregular dark lesions on leaves and dark areas on stems. Tomato fruits can also develop firm dark lesions. Removing severely infected plant material, improving air circulation, avoiding prolonged leaf wetness, and monitoring plants carefully can help reduce the spread of the disease.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "tomato",
      "late blight",
      "disease",
      "symptoms",
      "prevention",
    ],
  },

  {
    crop: "Tomato",
    topic: "disease",
    disease: "Healthy",
    language: "en",
    title: "Healthy Tomato Plants",
    content:
      "Healthy tomato plants generally have vigorous green leaves, strong stems, and normal growth. Regular monitoring is important because early detection of disease can reduce crop losses. Farmers should inspect leaves, stems, and fruits regularly and maintain appropriate spacing, irrigation, nutrition, and field sanitation.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "tomato",
      "healthy",
      "plant health",
      "monitoring",
    ],
  },

  {
    crop: "Tomato",
    topic: "disease",
    disease: "Uncertain",
    language: "en",
    title: "Uncertain Tomato Disease Assessment",
    content:
      "When a disease assessment is uncertain, the farmer should not assume that a specific disease is present. The plant should be inspected carefully for symptoms on leaves, stems, and fruits. Taking a clear photograph in good lighting and consulting reliable agricultural guidance can improve assessment. Avoid applying a treatment solely on the basis of an uncertain diagnosis.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "tomato",
      "uncertain",
      "diagnosis",
      "plant health",
    ],
  },

  {
    crop: "Tomato",
    topic: "irrigation",
    disease: null,
    language: "en",
    title: "Tomato Irrigation",
    content:
      "Tomato plants need consistent access to water, especially during flowering and fruit development. Irrigation should provide adequate moisture without keeping the soil continuously waterlogged. Watering near the base of the plant and avoiding unnecessary wetting of foliage can help reduce conditions that favor some diseases.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "tomato",
      "irrigation",
      "watering",
      "water management",
    ],
  },

  {
    crop: "Tomato",
    topic: "general care",
    disease: null,
    language: "en",
    title: "General Tomato Crop Care",
    content:
      "Tomato crops should be monitored regularly for changes in leaf color, spots, wilting, pests, and fruit problems. Maintaining appropriate plant spacing, removing severely diseased plant material, controlling weeds, providing suitable nutrition, and managing irrigation are important parts of good crop management.",
    source: "Agricultural Extension Knowledge Base",
    sourceUrl: "",
    tags: [
      "tomato",
      "crop care",
      "plant health",
      "monitoring",
    ],
  },
];

const seedKnowledge = async () => {
  try {
    await connectDB();

    await AgriculturalKnowledge.deleteMany({});

    await AgriculturalKnowledge.insertMany(knowledgeData);

    console.log(
      `Successfully inserted ${knowledgeData.length} knowledge documents.`
    );

    process.exit(0);
  } catch (error) {
    console.error("Knowledge seed failed:", error.message);
    process.exit(1);
  }
};

seedKnowledge();
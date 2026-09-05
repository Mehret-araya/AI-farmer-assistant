import Crop from "../models/Crop.js";
import DiseaseAnalysis from "../models/DiseaseAnalysis.js";
import { getWeather } from "./weatherService.js";
import { searchKnowledgeSemantically } from "./knowledgeRetrievalService.js";

export const getFarmerCrops = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return await Crop.find({
    userId,
  }).select(
    "name variety plantingDate growthStage location farmSize latitude longitude"
  );
};

export const getFarmerDiseaseAnalyses = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return await DiseaseAnalysis.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .limit(10);
};

export const getFarmerWeather = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const crops = await Crop.find({
    userId,
  }).select("latitude longitude");

  const cropWithCoordinates = crops.find(
    (crop) =>
      crop.latitude !== null &&
      crop.latitude !== undefined &&
      crop.longitude !== null &&
      crop.longitude !== undefined
  );

  if (!cropWithCoordinates) {
    return null;
  }

  return await getWeather(
    cropWithCoordinates.latitude,
    cropWithCoordinates.longitude
  );
};

export const getAgriculturalKnowledge = async ({
  question,
  language = "en",
  disease = null,
}) => {
  return await searchKnowledgeSemantically({
    question,
    language,
    disease,
    limit: 5,
  });
};
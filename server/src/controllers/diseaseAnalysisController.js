
import Crop from "../models/Crop.js";
import CropImage from "../models/CropImage.js";
import DiseaseAnalysis from "../models/DiseaseAnalysis.js";
import { analyzeCropImage } from "../ai/aiGateway.js";

// Analyze a crop image
export const analyzeDisease = async (req, res) => {
  try {
    const { cropId, imageId } = req.params;

    // 1. Check that the crop belongs to the logged-in user
    const crop = await Crop.findOne({
      _id: cropId,
      userId: req.user.userId,
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    // 2. Check that the image belongs to this crop and user
    const image = await CropImage.findOne({
      _id: imageId,
      cropId: crop._id,
      userId: req.user.userId,
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Crop image not found",
      });
    }

    // 3. Send the image to the AI Gateway
    const aiResult = await analyzeCropImage(
      image.imageUrl
    );

    // 4. Save the analysis
    const analysis = await DiseaseAnalysis.create({
      userId: req.user.userId,
      cropId: crop._id,
      imageId: image._id,
      disease: aiResult.disease,
      confidence: aiResult.confidence,
      explanation: aiResult.message || "",
      recommendation: "",
    });

    // 5. Return the result
    return res.status(201).json({
      success: true,
      message: "Crop image analyzed successfully",
      analysis,
    });
  } catch (error) {
    console.error("Disease analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while analyzing crop image",
    });
  }
};

// Get analyses for a crop
export const getCropAnalyses = async (req, res) => {
  try {
    const { cropId } = req.params;

    const crop = await Crop.findOne({
      _id: cropId,
      userId: req.user.userId,
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    const analyses = await DiseaseAnalysis.find({
      cropId: crop._id,
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      analyses,
    });
  } catch (error) {
    console.error("Get disease analyses error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while retrieving disease analyses",
    });
  }
};


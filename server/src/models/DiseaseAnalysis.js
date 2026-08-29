
import mongoose from "mongoose";

const diseaseAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },

    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CropImage",
      required: true,
    },

    disease: {
      type: String,
      enum: [
        "Healthy",
        "Early Blight",
        "Late Blight",
        "Uncertain",
      ],
      required: true,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1,
      required: true,
    },

    explanation: {
      type: String,
      default: "",
    },

    recommendation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const DiseaseAnalysis = mongoose.model(
  "DiseaseAnalysis",
  diseaseAnalysisSchema
);

export default DiseaseAnalysis;


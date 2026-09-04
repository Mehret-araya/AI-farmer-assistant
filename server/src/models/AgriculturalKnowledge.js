import mongoose from "mongoose";

const agriculturalKnowledgeSchema = new mongoose.Schema(
  {
    crop: {
      type: String,
      required: true,
      enum: ["Tomato"],
    },

    topic: {
      type: String,
      required: true,
    },

    disease: {
      type: String,
      enum: [
        "Healthy",
        "Early Blight",
        "Late Blight",
        "Uncertain",
        null,
      ],
      default: null,
    },

    language: {
      type: String,
      required: true,
      enum: ["en", "am", "sw", "hi", "es"],
      default: "en",
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
    embedding: {
  type: [Number],
  default: [],
},

    source: {
      type: String,
      default: "",
    },

    sourceUrl: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const AgriculturalKnowledge = mongoose.model(
  "AgriculturalKnowledge",
  agriculturalKnowledgeSchema
);

export default AgriculturalKnowledge;
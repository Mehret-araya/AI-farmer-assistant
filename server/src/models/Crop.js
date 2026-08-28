import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      enum: ["tomato"],
      default: "tomato",
    },

    variety: {
      type: String,
      trim: true,
      default: "",
    },

    plantingDate: {
      type: Date,
      required: true,
    },

    growthStage: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    farmSize: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Crop = mongoose.model("Crop", cropSchema);

export default Crop;
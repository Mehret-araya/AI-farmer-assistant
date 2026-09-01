import mongoose from "mongoose";

const SUPPORTED_CROPS = [
  "tomato",
  "maize",
  "wheat",
  "coffee",
];

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
      lowercase: true,
      enum: SUPPORTED_CROPS,
            //enum: ["tomato", "potato", "corn", "wheat", "rice", "apple", "grapes"],  // Add more   if we need it for many crops as we need not only for the tomato

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
    latitude: {
  type: Number,
  min: -90,
  max: 90,
  default: null,
},

longitude: {
  type: Number,
  min: -180,
  max: 180,
  default: null,
},
  },
  {
    timestamps: true,
  }
);

const Crop = mongoose.model("Crop", cropSchema);

export { SUPPORTED_CROPS };

export default Crop;
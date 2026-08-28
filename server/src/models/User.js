
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["farmer", "admin"],
      default: "farmer",
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    farmSize: {
      type: Number,
      default: 0,
      min: 0,
    },

    language: {
      type: String,
      enum: ["en", "am", "sw", "hi", "es"],
      default: "en",
    },

    privacyConsent: {
      type: Boolean,
      default: false,
    },

    consentDate: {
      type: Date,
      default: null,
    },

    monthlyAnalysisCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    usagePeriodStart: {
      type: Date,
      default: Date.now,
    },

    plan: {
      type: String,
      enum: ["free"],
      default: "free",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;


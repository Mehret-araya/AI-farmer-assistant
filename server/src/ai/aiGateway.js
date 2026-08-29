// AI Gateway
// This module will communicate with the AI disease detection
// service later.

export const analyzeCropImage = async (imageUrl) => {
  if (!imageUrl) {
    throw new Error("Image URL is required");
  }

  // Temporary response.
  // The real AI model/API will be connected here later.
  return {
    disease: "Uncertain",
    confidence: 0,
    message:
      "AI disease detection is not connected yet.",
  };
};


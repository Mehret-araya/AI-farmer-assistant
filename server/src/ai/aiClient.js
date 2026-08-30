const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL ||
  "http://localhost:8000";

export const requestDiseasePrediction = async (
  imageUrl,
  cropType
) => {
  if (!imageUrl) {
    throw new Error("Image URL is required");
  }

  if (!cropType) {
    throw new Error("Crop type is required");
  }

  const response = await fetch(
    `${AI_SERVICE_URL}/predict`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl,
        cropType,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `AI service returned status ${response.status}`
    );
  }

  return response.json();
};
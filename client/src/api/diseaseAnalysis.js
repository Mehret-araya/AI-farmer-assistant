const API_URL = "http://localhost:5000";

export const analyzeCropImage = async (
  cropId,
  imageId,
  token
) => {
  const response = await fetch(
    `${API_URL}/disease-analysis/${cropId}/images/${imageId}/analyze`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to analyze crop image"
    );
  }

  return data;
};

export const getCropAnalyses = async (cropId, token) => {
  const response = await fetch(
    `${API_URL}/disease-analysis/${cropId}/analyses`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get disease analyses"
    );
  }

  return data;
};


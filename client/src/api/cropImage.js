
const API_URL = "http://localhost:5000";

// Upload a crop image
export const uploadCropImage = async (
  cropId,
  imageFile,
  token
) => {
  const formData = new FormData();

  formData.append("image", imageFile);

  const response = await fetch(
    `${API_URL}/crops/${cropId}/images`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Image upload failed"
    );
  }

  return data;
};

// Get all images for a crop
export const getCropImages = async (cropId, token) => {
  const response = await fetch(
    `${API_URL}/crops/${cropId}/images`,
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
      data.message || "Failed to get crop images"
    );
  }

  return data;
};


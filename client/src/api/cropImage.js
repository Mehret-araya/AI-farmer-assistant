const API_URL = "http://localhost:5000";

export const uploadCropImage = async (cropId, imageFile, token) => {
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
    throw new Error(data.message || "Image upload failed");
  }

  return data;
};


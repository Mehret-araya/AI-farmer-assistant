const API_URL = "http://localhost:5000";

export const createCrop = async (cropData, token) => {
  const response = await fetch(`${API_URL}/crops`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cropData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create crop");
  }

  return data;
};

export const getCrops = async (token) => {
  const response = await fetch(`${API_URL}/crops`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get crops");
  }

  return data;
};

export const getCropById = async (cropId, token) => {
  const response = await fetch(`${API_URL}/crops/${cropId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get crop");
  }

  return data;
};

export const updateCrop = async (cropId, cropData, token) => {
  const response = await fetch(`${API_URL}/crops/${cropId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cropData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update crop");
  }

  return data;
};

export const deleteCrop = async (cropId, token) => {
  const response = await fetch(`${API_URL}/crops/${cropId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete crop");
  }

  return data;
};
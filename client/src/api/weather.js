const API_URL = "http://localhost:5000";

export const getWeather = async (latitude, longitude, token) => {
  if (latitude === undefined || latitude === "") {
    throw new Error("Latitude is required.");
  }

  if (longitude === undefined || longitude === "") {
    throw new Error("Longitude is required.");
  }

  if (!token) {
    throw new Error("Authentication token is required.");
  }

  const response = await fetch(
    `${API_URL}/weather?latitude=${encodeURIComponent(
      latitude
    )}&longitude=${encodeURIComponent(longitude)}`,
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
      data.message || "Failed to get weather information."
    );
  }

  return data;
};
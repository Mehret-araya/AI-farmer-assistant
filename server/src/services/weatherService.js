const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

export const getWeather = async (latitude, longitude) => {
  if (latitude === undefined || latitude === "") {
    throw new Error("Latitude is required.");
  }

  if (longitude === undefined || longitude === "") {
    throw new Error("Longitude is required.");
  }

  const url = new URL(OPEN_METEO_URL);

  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);

  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m"
  );

  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum"
  );

  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return await response.json();
};
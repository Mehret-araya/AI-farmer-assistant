import { getWeather } from "../services/weatherService.js";

export const getWeatherData = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const weather = await getWeather(latitude, longitude);

    return res.status(200).json({
      success: true,
      weather,
    });
  } catch (error) {
    console.error("Weather error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve weather data",
    });
  }
};
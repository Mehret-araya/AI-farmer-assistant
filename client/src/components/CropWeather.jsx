import { useEffect, useState } from "react";
import { getWeather } from "../api/weather";

function CropWeather({ latitude, longitude }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWeather = async () => {
      if (latitude === null || latitude === undefined || latitude === "") {
        setError("Farm latitude is not available.");
        return;
      }

      if (
        longitude === null ||
        longitude === undefined ||
        longitude === ""
      ) {
        setError("Farm longitude is not available.");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getWeather(
          latitude,
          longitude,
          token
        );

        setWeather(data.weather);
      } catch (err) {
        setError(
          err.message || "Failed to load weather."
        );
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="mt-4 rounded-lg bg-blue-50 p-4">
        <p>Loading farm weather...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-lg bg-yellow-50 p-4">
        <p className="text-yellow-700">
          Weather unavailable: {error}
        </p>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="mt-4 rounded-lg bg-blue-50 p-4">
      <h4 className="text-lg font-semibold text-blue-700">
        🌦️ Farm Weather
      </h4>

      <p className="mt-2">
        <strong>Temperature:</strong>{" "}
        {weather.current?.temperature_2m}{" "}
        {weather.current_units?.temperature_2m || "°C"}
      </p>

      <p>
        <strong>Humidity:</strong>{" "}
        {weather.current?.relative_humidity_2m}%
      </p>

      <p>
        <strong>Rain:</strong>{" "}
        {weather.current?.precipitation} mm
      </p>

      <p>
        <strong>Wind:</strong>{" "}
        {weather.current?.wind_speed_10m}{" "}
        {weather.current_units?.wind_speed_10m || "km/h"}
      </p>

      <h5 className="mt-4 font-semibold text-blue-700">
        7-Day Forecast
      </h5>

      {weather.daily?.time?.map((date, index) => (
        <div
          key={date}
          className="mt-2 rounded bg-white p-3"
        >
          <p>
            <strong>{date}</strong>
          </p>

          <p>
            Max:{" "}
            {weather.daily.temperature_2m_max?.[index]}°C
          </p>

          <p>
            Min:{" "}
            {weather.daily.temperature_2m_min?.[index]}°C
          </p>

          <p>
            Rain:{" "}
            {weather.daily.precipitation_sum?.[index]} mm
          </p>
        </div>
      ))}
    </div>
  );
}

export default CropWeather;
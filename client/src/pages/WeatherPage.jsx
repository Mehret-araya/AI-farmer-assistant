import { useState } from "react";
import { getWeather } from "../api/weather";

function WeatherPage() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setWeather(null);

    if (!latitude || !longitude) {
      setError("Please enter both latitude and longitude.");
      return;
    }

    const latitudeNumber = Number(latitude);
    const longitudeNumber = Number(longitude);

    if (
      !Number.isFinite(latitudeNumber) ||
      !Number.isFinite(longitudeNumber)
    ) {
      setError("Latitude and longitude must be valid numbers.");
      return;
    }

    if (
      latitudeNumber < -90 ||
      latitudeNumber > 90
    ) {
      setError("Latitude must be between -90 and 90.");
      return;
    }

    if (
      longitudeNumber < -180 ||
      longitudeNumber > 180
    ) {
      setError("Longitude must be between -180 and 180.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in.");
      return;
    }

    setLoading(true);

    try {
      const data = await getWeather(
        latitudeNumber,
        longitudeNumber,
        token
      );

      setWeather(data.weather);
    } catch (err) {
      setError(
        err.message || "Failed to get weather information."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="mx-auto max-w-3xl">

        <h1 className="text-4xl font-bold text-green-700">
          Weather Intelligence 🌦️
        </h1>

        <p className="mt-2 text-gray-700">
          Check current weather conditions for your farm location.
        </p>

        <div className="mt-8 rounded-lg bg-white p-6 shadow">

          <form onSubmit={handleSubmit}>

            <div>
              <label
                htmlFor="latitude"
                className="font-semibold text-gray-700"
              >
                Latitude
              </label>

              <input
                id="latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(event) =>
                  setLatitude(event.target.value)
                }
                placeholder="e.g. 13.4967"
                className="mt-2 w-full rounded-lg border p-3"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="longitude"
                className="font-semibold text-gray-700"
              >
                Longitude
              </label>

              <input
                id="longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(event) =>
                  setLongitude(event.target.value)
                }
                placeholder="e.g. 39.4753"
                className="mt-2 w-full rounded-lg border p-3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              {loading
                ? "Getting Weather..."
                : "Check Weather"}
            </button>

          </form>

          {error && (
            <p className="mt-4 text-red-600">
              {error}
            </p>
          )}

          {weather && (
            <div className="mt-8 rounded-lg bg-green-50 p-6">

              <h2 className="text-2xl font-bold text-green-700">
                Current Weather
              </h2>

              <p className="mt-4">
                <strong>Temperature:</strong>{" "}
                {weather.current?.temperature_2m}{" "}
                {weather.current_units?.temperature_2m || "°C"}
              </p>

              <p>
                <strong>Humidity:</strong>{" "}
                {weather.current?.relative_humidity_2m}%
              </p>

              <p>
                <strong>Precipitation:</strong>{" "}
                {weather.current?.precipitation} mm
              </p>

              <p>
                <strong>Wind Speed:</strong>{" "}
                {weather.current?.wind_speed_10m}{" "}
                {weather.current_units?.wind_speed_10m || "km/h"}
              </p>

              <h3 className="mt-6 text-xl font-semibold text-green-700">
                7-Day Forecast
              </h3>

              {weather.daily?.time?.map(
                (date, index) => (
                  <div
                    key={date}
                    className="mt-3 rounded-lg bg-white p-4 shadow-sm"
                  >
                    <p>
                      <strong>{date}</strong>
                    </p>

                    <p>
                      Max:{" "}
                      {weather.daily.temperature_2m_max?.[index]}
                      °C
                    </p>

                    <p>
                      Min:{" "}
                      {weather.daily.temperature_2m_min?.[index]}
                      °C
                    </p>

                    <p>
                      Rain:{" "}
                      {weather.daily.precipitation_sum?.[index]}
                      mm
                    </p>
                    <p>
                      Rain Probability:{" "}
                      {weather.daily.precipitation_probability_max?.[index] ?? 0}%
                    </p>
                    
                  </div>
                )
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default WeatherPage;
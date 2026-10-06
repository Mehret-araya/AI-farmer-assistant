
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
    <div
      className="page-view weather-page min-h-screen w-full bg-[#050A08] px-4 py-8 text-[#86EFAC] sm:px-6 lg:px-8"
      style={{
        minHeight: "100vh",
        backgroundColor: "#050A08",
        color: "#86EFAC",
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(0,255,136,0.10), transparent 35%), radial-gradient(circle at 0% 60%, rgba(34,197,94,0.05), transparent 30%), radial-gradient(circle at 100% 80%, rgba(0,255,136,0.05), transparent 30%)",
      }}
    >
      <div className="relative mx-auto w-full max-w-3xl">

    
<div className="mb-8">
  <div
    className="mb-4 inline-flex items-center rounded-full border border-[#22C55E] bg-[#166534] px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#DCFCE7] shadow-[0_0_20px_rgba(34,197,94,0.30)]"
    style={{
      backgroundColor: "#166534",
      color: "#DCFCE7",
      borderColor: "#22C55E",
    }}
  >
    Weather Intelligence
  </div>

  <h1
    className="font-sans text-3xl font-extrabold uppercase tracking-[0.12em] text-[#1E4D2B] drop-shadow-[0_0_18px_rgba(22,101,52,0.35)] sm:text-4xl"
    style={{
      color: "#1E4D2B",
      fontFamily: "Inter, Arial, sans-serif",
    }}
  >
    Weather Intelligence 🌦️
  </h1>

  <div
    className="mt-3 inline-block rounded-xl border border-[#22C55E]/30 bg-[#166534] px-4 py-2 shadow-[0_0_20px_rgba(34,197,94,0.20)]"
    style={{
      backgroundColor: "#166534",
      borderColor: "rgba(34,197,94,0.30)",
    }}
  >
    <p
      className="text-sm font-semibold leading-6 text-[#DCFCE7] sm:text-base"
      style={{ color: "#DCFCE7" }}
    >
      Check current weather conditions for your farm location.
    </p>
  </div>
</div>

        <div
          className="rounded-[20px] border border-[#22C55E]/25 bg-[#0F1A14] p-5 shadow-[0_0_40px_rgba(34,197,94,0.15)] sm:p-7"
          style={{
            backgroundColor: "#0F1A14",
            borderColor: "rgba(34,197,94,0.25)",
          }}
        >

          <form onSubmit={handleSubmit}>

            {/* Latitude */}
            <div>
              <label
                htmlFor="latitude"
                className="text-sm font-semibold uppercase tracking-wider text-[#22C55E]"
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
                className="mt-2 w-full rounded-xl border border-[#22C55E]/30 bg-[#0F1A14] p-3 text-[#22C55E] placeholder:text-[#166534] focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/40"
                style={{
                  backgroundColor: "#0F1A14",
                  color: "#22C55E",
                  borderColor: "rgba(34,197,94,0.30)",
                }}
              />
            </div>

            {/* Longitude */}
            <div className="mt-5">
              <label
                htmlFor="longitude"
                className="text-sm font-semibold uppercase tracking-wider text-[#22C55E]"
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
                className="mt-2 w-full rounded-xl border border-[#22C55E]/30 bg-[#0F1A14] p-3 text-[#22C55E] placeholder:text-[#166534] focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/40"
                style={{
                  backgroundColor: "#0F1A14",
                  color: "#22C55E",
                  borderColor: "rgba(34,197,94,0.30)",
                }}
              />
            </div>

            {/* Check Weather Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 rounded-full border border-[#22C55E] bg-[#166534] px-6 py-3 font-semibold text-[#DCFCE7] shadow-[0_0_20px_rgba(34,197,94,0.30)] transition duration-200 hover:bg-[#15803D] hover:shadow-[0_0_35px_rgba(34,197,94,0.45)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              style={{
                backgroundColor: "#166534",
                color: "#DCFCE7",
                borderColor: "#22C55E",
              }}
            >
              {loading
                ? "Getting Weather..."
                : "Check Weather"}
            </button>

          </form>

          {/* Error */}
          {error && (
            <div
              className="mt-6 rounded-2xl border border-red-400/25 bg-[#160B0B] p-4 text-sm leading-6 text-red-300"
              style={{
                backgroundColor: "#160B0B",
              }}
            >
              {error}
            </div>
          )}

          {/* Current Weather + Forecast */}
          {weather && (
            <div
              className="mt-8 rounded-2xl border border-[#22C55E]/25 bg-[#050A08] p-5 shadow-[0_0_35px_rgba(34,197,94,0.10)] sm:p-6"
              style={{
                backgroundColor: "#050A08",
                borderColor: "rgba(34,197,94,0.25)",
              }}
            >

              <h2
                className="font-sans text-2xl font-extrabold uppercase tracking-[0.10em] text-[#22C55E] drop-shadow-[0_0_10px_rgba(34,197,94,0.25)]"
                style={{
                  color: "#22C55E",
                  fontFamily: "Inter, Arial, sans-serif",
                }}
              >
                Current Weather
              </h2>

              <div className="mt-5 space-y-3 text-sm leading-7 text-[#86EFAC] sm:text-base">

                <p>
                  <strong className="font-semibold text-[#4ADE80]">
                    Temperature:
                  </strong>{" "}
                  {weather.current?.temperature_2m}{" "}
                  {weather.current_units?.temperature_2m || "°C"}
                </p>

                <p>
                  <strong className="font-semibold text-[#4ADE80]">
                    Humidity:
                  </strong>{" "}
                  {weather.current?.relative_humidity_2m}%
                </p>

                <p>
                  <strong className="font-semibold text-[#4ADE80]">
                    Precipitation:
                  </strong>{" "}
                  {weather.current?.precipitation} mm
                </p>

                <p>
                  <strong className="font-semibold text-[#4ADE80]">
                    Wind Speed:
                  </strong>{" "}
                  {weather.current?.wind_speed_10m}{" "}
                  {weather.current_units?.wind_speed_10m || "km/h"}
                </p>

              </div>

              <h3
                className="mt-8 font-sans text-xl font-bold uppercase tracking-[0.08em] text-[#22C55E]"
                style={{
                  color: "#22C55E",
                  fontFamily: "Inter, Arial, sans-serif",
                }}
              >
                7-Day Forecast
              </h3>

              <div className="mt-4 space-y-3">
                {weather.daily?.time?.map(
                  (date, index) => (
                    <div
                      key={date}
                      className="rounded-2xl border border-[#22C55E]/20 bg-[#0F1A14] p-4 shadow-[0_0_20px_rgba(34,197,94,0.06)]"
                      style={{
                        backgroundColor: "#0F1A14",
                        borderColor: "rgba(34,197,94,0.20)",
                      }}
                    >
                      <p className="font-bold text-[#4ADE80]">
                        {date}
                      </p>

                      <div className="mt-2 space-y-1 text-sm leading-6 text-[#86EFAC]">
                        <p>
                          <span className="text-[#6EE7B7]">
                            Max:
                          </span>{" "}
                          {weather.daily.temperature_2m_max?.[index]}
                          °C
                        </p>

                        <p>
                          <span className="text-[#6EE7B7]">
                            Min:
                          </span>{" "}
                          {weather.daily.temperature_2m_min?.[index]}
                          °C
                        </p>

                        <p>
                          <span className="text-[#6EE7B7]">
                            Rain:
                          </span>{" "}
                          {weather.daily.precipitation_sum?.[index]}
                          mm
                        </p>

                        <p>
                          <span className="text-[#6EE7B7]">
                            Rain Probability:
                          </span>{" "}
                          {weather.daily.precipitation_probability_max?.[index] ?? 0}%
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default WeatherPage;


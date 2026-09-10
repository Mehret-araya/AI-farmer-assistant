import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCrops } from "../api/crop";
import { getCropAnalyses } from "../api/diseaseAnalysis";
import { getPendingImageCount } from "../storage/offlineDb";
import VoiceAssistant from "../components/VoiceAssistant";

function DashboardPage() {
  const { user, loading, logout } = useAuth();

  const [crops, setCrops] = useState([]);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isOnline, setIsOnline] = useState(
    navigator.onLine
  );
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [error, setError] = useState("");

  // Monitor internet connection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load dashboard information
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        return;
      }

      try {
        setLoadingSummary(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("You must be logged in.");
        }

        // Get user's crops
        const cropData = await getCrops(token);
        const userCrops = cropData.crops || [];

        setCrops(userCrops);

        let totalAnalyses = 0;
        let allAnalyses = [];

        // Get analyses for every crop
        for (const crop of userCrops) {
          try {
            const analysisData = await getCropAnalyses(
              crop._id,
              token
            );

            const cropAnalyses =
              analysisData.analyses || [];

            totalAnalyses += cropAnalyses.length;

            // Add crop information to each analysis
            const analysesWithCrop = cropAnalyses.map(
              (analysis) => ({
                ...analysis,
                cropName: crop.name,
              })
            );

            allAnalyses = [
              ...allAnalyses,
              ...analysesWithCrop,
            ];
          } catch (analysisError) {
            console.error(
              `Failed to load analyses for crop ${crop._id}:`,
              analysisError
            );
          }
        }

        setAnalysisCount(totalAnalyses);

        // Sort newest first
        allAnalyses.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );

        // Keep only the 5 most recent analyses
        setRecentAnalyses(
          allAnalyses.slice(0, 5)
        );

        // Get number of images waiting for sync
        const pendingCount =
          await getPendingImageCount();

        setPendingSyncCount(pendingCount);
      } catch (err) {
        setError(
          err.message ||
            "Failed to load dashboard information."
        );
      } finally {
        setLoadingSummary(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Refresh pending sync count periodically
  useEffect(() => {
    const updatePendingCount = async () => {
      try {
        const count = await getPendingImageCount();
        setPendingSyncCount(count);
      } catch (error) {
        console.error(
          "Failed to get pending image count:",
          error
        );
      }
    };

    updatePendingCount();

    const interval = setInterval(
      updatePendingCount,
      5000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-green-700">
              Welcome, {user.name}! 🌱
            </h1>

            <p className="mt-2 text-gray-700">
              Welcome to your AI Farmer Assistant dashboard.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Connection and Sync Status */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">

          {/* Internet Status */}
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Connection Status
            </p>

            <div className="mt-3 flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full ${
                  isOnline
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></span>

              <p
                className={`text-xl font-bold ${
                  isOnline
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {isOnline
                  ? "Online"
                  : "Offline"}
              </p>
            </div>

            <p className="mt-2 text-gray-600">
              {isOnline
                ? "Internet connection is available."
                : "You are offline. Images will be synchronized when you reconnect."}
            </p>
          </div>

          {/* Pending Sync */}
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Pending Sync
            </p>

            <p className="mt-2 text-4xl font-bold text-green-700">
              {loadingSummary
                ? "..."
                : pendingSyncCount}
            </p>

            <p className="mt-2 text-gray-600">
              {pendingSyncCount === 0
                ? "No images waiting to sync."
                : `${pendingSyncCount} image${
                    pendingSyncCount === 1
                      ? ""
                      : "s"
                  } waiting to sync.`}
            </p>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Summary cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">

          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              My Crops
            </p>

            <p className="mt-2 text-4xl font-bold text-green-700">
              {loadingSummary
                ? "..."
                : crops.length}
            </p>

            <p className="mt-2 text-gray-600">
              Crops currently registered
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Disease Analyses
            </p>

            <p className="mt-2 text-4xl font-bold text-green-700">
              {loadingSummary
                ? "..."
                : analysisCount}
            </p>

            <p className="mt-2 text-gray-600">
              Images analyzed so far
            </p>
          </div>

        </div>

        {/* Recent Analyses */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-green-700">
                Recent Analyses
              </h2>

              <p className="mt-1 text-gray-600">
                Your five most recent crop disease analyses.
              </p>
            </div>

            <Link
              to="/crops"
              className="inline-block rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700"
            >
              View Crop History
            </Link>
          </div>

          {loadingSummary ? (
            <p className="mt-5 text-gray-600">
              Loading recent analyses...
            </p>
          ) : recentAnalyses.length === 0 ? (
            <div className="mt-5 rounded-lg bg-gray-50 p-5 text-gray-600">
              No disease analyses yet.
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {recentAnalyses.map((analysis) => (
                <div
                  key={analysis._id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {analysis.cropName}
                      </p>

                      <p className="text-sm text-gray-500">
                        {analysis.createdAt
                          ? new Date(
                              analysis.createdAt
                            ).toLocaleString()
                          : "Date unavailable"}
                      </p>
                    </div>

                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      {analysis.disease ||
                        "Uncertain"}
                    </span>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-gray-600">
                      Confidence
                    </p>

                    <p className="font-semibold text-gray-800">
                      {typeof analysis.confidence ===
                      "number"
                        ? `${Math.round(
                            analysis.confidence * 100
                          )}%`
                        : "Unavailable"}
                    </p>
                  </div>

                  {analysis.explanation && (
                    <p className="mt-3 text-gray-700">
                      <strong>
                        Explanation:
                      </strong>{" "}
                      {analysis.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="text-2xl font-semibold text-green-700">
            Your Profile
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <p>
              <strong>Name:</strong>{" "}
              {user.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {user.email}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {user.location ||
                "Not provided"}
            </p>

            <p>
              <strong>Farm Size:</strong>{" "}
              {user.farmSize ??
                "Not provided"}
            </p>

            <p>
              <strong>Language:</strong>{" "}
              {user.language}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {user.role}
            </p>
          </div>
        </div>

        {/* Main actions */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold text-green-700">
              🌱 My Crops
            </h2>

            <p className="mt-2 text-gray-600">
              Add and manage crops, upload images,
              and analyze crop health.
            </p>

            <Link
              to="/crops"
              className="mt-5 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Manage My Crops
            </Link>

            <Link
              to="/weather"
              className="mt-4 ml-4 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Check Weather 🌦️
            </Link>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold text-green-700">
              🤖 AI Disease Detection
            </h2>

            <p className="mt-2 text-gray-600">
              Upload crop images from your crop page
              to check for supported diseases.
            </p>

            <Link
              to="/crops"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Analyze Crop
            </Link>
          </div>

        </div>

        {/* Voice Assistant */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="text-2xl font-semibold text-green-700">
            🎙️ Voice Assistant
          </h2>

          <p className="mt-2 text-gray-600">
            Ask the AI Farmer Assistant a question using your voice.
          </p>

          <div className="mt-5">
            <VoiceAssistant
              language={user.language}
            />
          </div>
        </div>

        {/* Coming soon */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="text-2xl font-semibold text-green-700">
            🚧 Coming Next
          </h2>

          <ul className="mt-4 space-y-2 text-gray-700">
            <li>🌦️ Weather intelligence</li>
            <li>🤖 AI Farmer Assistant</li>
            <li>📚 Agricultural knowledge and recommendations</li>
            <li>🎙️ Voice interaction</li>
            <li>🌍 Expanded crop and disease support</li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;
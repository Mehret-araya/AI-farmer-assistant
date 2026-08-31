import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCrops } from "../api/crop";
import { getCropAnalyses } from "../api/diseaseAnalysis";

function DashboardPage() {
  const { user, loading, logout } = useAuth();

  const [crops, setCrops] = useState([]);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [error, setError] = useState("");

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

        const cropData = await getCrops(token);
        const userCrops = cropData.crops || [];

        setCrops(userCrops);

        let totalAnalyses = 0;

        for (const crop of userCrops) {
          try {
            const analysisData = await getCropAnalyses(
              crop._id,
              token
            );

            totalAnalyses += (
              analysisData.analyses || []
            ).length;
          } catch (analysisError) {
            console.error(
              `Failed to load analyses for crop ${crop._id}:`,
              analysisError
            );
          }
        }

        setAnalysisCount(totalAnalyses);
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
              {loadingSummary ? "..." : crops.length}
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
              {loadingSummary ? "..." : analysisCount}
            </p>

            <p className="mt-2 text-gray-600">
              Images analyzed so far
            </p>
          </div>

        </div>

        {/* Profile */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="text-2xl font-semibold text-green-700">
            Your Profile
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <p>
              <strong>Name:</strong> {user.name}
            </p>

            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {user.location || "Not provided"}
            </p>

            <p>
              <strong>Farm Size:</strong>{" "}
              {user.farmSize ?? "Not provided"}
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


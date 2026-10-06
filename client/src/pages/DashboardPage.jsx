
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
    <div
      className="min-h-screen bg-[#1E3A1F] text-[#4e5550]"
      style={{
        minHeight: "100vh",
        backgroundColor: "#1E3A1F",
      }}
    >
      <div className="mx-auto max-w-7xl">

        {/* Hero */}
        <section
          className="relative flex min-h-[430px] items-center justify-center overflow-hidden px-6 py-16 text-center md:min-h-[500px]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=85')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 w-full max-w-4xl">
            <div className="mb-6 inline-flex rounded-full border border-[#A3E635]/60 bg-[#1E3A1F]/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#A3E635] backdrop-blur-sm">
              AI Farmer Assistant
            </div>

            <h1 className="font-serif text-5xl font-bold tracking-tight text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.65)] md:text-6xl">
              Welcome, {user.name}! 🌱
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] md:text-lg">
              Welcome to your AI Farmer Assistant dashboard.
            </p>

            <button
              onClick={logout}
              className="mt-8 rounded-full border border-[#647150] bg-transparent px-7 py-3 font-semibold text-[#686a63] transition duration-200 hover:bg-[#e5e9de] hover:text-[#0A0F08]"
              style={{
                borderColor: "#A3E635",
                color: "#F7FEE7",
              }}
            >
              Logout
            </button>
          </div>
        </section>

        {/* Main Dashboard Section */}
        <section className="px-4 py-10 sm:px-6 lg:px-8">

          {/* Dashboard Intro */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#405224]">
              Farm Overview
            </p>

            <h2 className="mt-2 font-serif text-3xl font-bold text-white md:text-4xl">
              Your Farm Intelligence
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#86EFAC]">
              Monitor your farm activity, crop health, connectivity,
              and recent disease analysis from one place.
            </p>
          </div>

          {/* Four Stat Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Connection Status */}
            <div
              className="rounded-2xl border border-[#A3E635]/20 bg-[#22331C] p-6 shadow-[0_0_30px_rgba(163,230,53,0.08)]"
              style={{
                backgroundColor: "#22331C",
                borderColor: "rgba(163,230,53,0.20)",
              }}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-[#86EFAC]">
                Connection Status
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${
                    isOnline
                      ? "bg-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.8)]"
                      : "bg-red-500"
                  }`}
                ></span>

                <p
                  className={`text-2xl font-bold ${
                    isOnline
                      ? "text-[#A3E635]"
                      : "text-red-400"
                  }`}
                >
                  {isOnline
                    ? "Online"
                    : "Offline"}
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-[#DCFCE7]/75">
                {isOnline
                  ? "Internet connection is available."
                  : "You are offline. Images will be synchronized when you reconnect."}
              </p>
            </div>

            {/* Pending Sync */}
            <div
              className="rounded-2xl border border-[#A3E635]/20 bg-[#22331C] p-6 shadow-[0_0_30px_rgba(163,230,53,0.08)]"
              style={{
                backgroundColor: "#22331C",
                borderColor: "rgba(163,230,53,0.20)",
              }}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-[#86EFAC]">
                Pending Sync
              </p>

              <p className="mt-3 text-4xl font-bold text-[#A3E635]">
                {loadingSummary
                  ? "..."
                  : pendingSyncCount}
              </p>

              <p className="mt-3 text-sm leading-6 text-[#DCFCE7]/75">
                {pendingSyncCount === 0
                  ? "No images waiting to sync."
                  : `${pendingSyncCount} image${
                      pendingSyncCount === 1
                        ? ""
                        : "s"
                    } waiting to sync.`}
              </p>
            </div>

            {/* My Crops */}
            <div
              className="rounded-2xl border border-[#A3E635]/20 bg-[#22331C] p-6 shadow-[0_0_30px_rgba(163,230,53,0.08)]"
              style={{
                backgroundColor: "#22331C",
                borderColor: "rgba(163,230,53,0.20)",
              }}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-[#86EFAC]">
                My Crops
              </p>

              <p className="mt-3 text-4xl font-bold text-[#A3E635]">
                {loadingSummary
                  ? "..."
                  : crops.length}
              </p>

              <p className="mt-3 text-sm leading-6 text-[#DCFCE7]/75">
                Crops currently registered
              </p>
            </div>

            {/* Disease Analyses */}
            <div
              className="rounded-2xl border border-[#A3E635]/20 bg-[#22331C] p-6 shadow-[0_0_30px_rgba(163,230,53,0.08)]"
              style={{
                backgroundColor: "#22331C",
                borderColor: "rgba(163,230,53,0.20)",
              }}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-[#86EFAC]">
                Disease Analyses
              </p>

              <p className="mt-3 text-4xl font-bold text-[#A3E635]">
                {loadingSummary
                  ? "..."
                  : analysisCount}
              </p>

              <p className="mt-3 text-sm leading-6 text-[#DCFCE7]/75">
                Images analyzed so far
              </p>
            </div>

          </div>

          {/* Error */}
          {error && (
            <div
              className="mt-6 rounded-2xl border border-red-400/30 bg-[#2A1111] p-4 text-red-300"
              style={{
                backgroundColor: "#2A1111",
              }}
            >
              {error}
            </div>
          )}

          {/* Recent Analyses */}
          <div
            className="mt-8 rounded-2xl border border-[#A3E635]/20 bg-[#22331C] p-6 shadow-[0_0_35px_rgba(163,230,53,0.08)] sm:p-7"
            style={{
              backgroundColor: "#22331C",
              borderColor: "rgba(163,230,53,0.20)",
            }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7f8673]">
                  Crop Health
                </p>

                <h2 className="mt-1 font-serif text-3xl font-bold text-white">
                  Recent Analyses
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#737d76]">
                  Your five most recent crop disease analyses.
                </p>
              </div>

              <Link
                to="/crops"
                className="inline-block rounded-full bg-[#798368] px-6 py-3 text-center font-semibold text-[#0A0F08] shadow-[0_0_20px_rgba(163,230,53,0.20)] transition duration-200 hover:bg-[#4c5b36] hover:shadow-[0_0_30px_rgba(163,230,53,0.35)]"
                style={{
                  backgroundColor: "#2d371e",
                  color: "#0A0F08",
                }}
              >

                View Crop History
              </Link>
            </div>

            {loadingSummary ? (
              <p className="mt-6 text-[#86EFAC]">
                Loading recent analyses...
              </p>
            ) : recentAnalyses.length === 0 ? (
              <div
                className="mt-6 rounded-2xl border border-[#A3E635]/15 bg-[#1E3A1F] p-5 text-[#86EFAC]"
                style={{
                  backgroundColor: "#1E3A1F",
                }}
              >
                No disease analyses yet.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div
                    key={analysis._id}
                    className="rounded-2xl border border-[#A3E635]/15 bg-[#1E3A1F] p-5"
                    style={{
                      backgroundColor: "#1E3A1F",
                      borderColor: "rgba(163,230,53,0.15)",
                    }}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-[#DCFCE7]">
                          {analysis.cropName}
                        </p>

                        <p className="mt-1 text-sm text-[#86EFAC]/70">
                          {analysis.createdAt
                            ? new Date(
                                analysis.createdAt
                              ).toLocaleString()
                            : "Date unavailable"}
                        </p>
                      </div>

                      <span className="inline-block rounded-full border border-[#A3E635]/30 bg-[#22331C] px-4 py-1.5 text-sm font-semibold text-[#747d65]">
                        {analysis.disease ||
                          "Uncertain"}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm uppercase tracking-wider text-[#86EFAC]">
                        Confidence
                      </p>

                      <p className="mt-1 font-semibold text-[#DCFCE7]">
                        {typeof analysis.confidence ===
                        "number"
                          ? `${Math.round(
                              analysis.confidence * 100
                            )}%`
                          : "Unavailable"}
                      </p>
                    </div>

                    {analysis.explanation && (
                      <p className="mt-4 text-sm leading-7 text-[#DCFCE7]/85">
                        <strong className="text-[#4d6428]">
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
          <div
            className="mt-8 rounded-2xl border border-[#A3E635]/20 bg-[#22331C] p-6 shadow-[0_0_35px_rgba(163,230,53,0.08)] sm:p-7"
            style={{
              backgroundColor: "#22331C",
              borderColor: "rgba(163,230,53,0.20)",
            }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#868d7c]">
              Account
            </p>

            <h2 className="mt-1 font-serif text-3xl font-bold text-white">
              Your Profile
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <p className="text-[#7a9885]">
                <strong className="text-[#84936d]">
                  Name:
                </strong>{" "}
                {user.name}
              </p>

              <p className="text-[#789080]">
                <strong className="text-[#79826b]">
                  Email:
                </strong>{" "}
                {user.email}
              </p>

              <p className="text-[#718578]">
                <strong className="text-[#666c5c]">
                  Location:
                </strong>{" "}
                {user.location ||
                  "Not provided"}
              </p>

              <p className="text-[#6b7c71]">
                <strong className="text-[#6c7461]">
                  Farm Size:
                </strong>{" "}
                {user.farmSize ??
                  "Not provided"}
              </p>

              <p className="text-[#6f8276]">
                <strong className="text-[#606657]">
                  Language:
                </strong>{" "}
                {user.language}
              </p>

              <p className="text-[#59675e]">
                <strong className="text-[#6f7664]">
                  Role:
                </strong>{" "}
                {user.role}
              </p>
            </div>
          </div>

          {/* Main Actions */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">

            {/* My Crops */}
            <div
              className="rounded-2xl border border-[#A3E635]/20 bg-[#22331C] p-6 shadow-[0_0_35px_rgba(163,230,53,0.08)] sm:p-7"
              style={{
                backgroundColor: "#22331C",
                borderColor: "rgba(163,230,53,0.20)",
              }}
            >
              <h2 className="font-serif text-3xl font-bold text-white">
                🌱 My Crops
              </h2>

              <p className="mt-3 leading-7 text-[#697163]">
                Add and manage crops, upload images,
                and analyze crop health.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/crops"
                  className="inline-block rounded-full bg-[#2d371e] px-6 py-3 font-semibold text-[#0A0F08] shadow-[0_0_20px_rgba(163,230,53,0.20)] transition duration-200 hover:bg-[#a3a89c]"
                >
                  Manage My Crops
                </Link>

                <Link
                  to="/weather"
                  className="inline-block rounded-full border border-[#506134] bg-transparent px-6 py-3 font-semibold text-[#787d6f] transition duration-200 hover:bg-[#939c84] hover:text-[#0A0F08]"
                >
                  Check Weather 
                </Link>
              </div>
            </div>

            {/* AI Disease Detection */}
            <div
              className="rounded-2xl border border-[#A3E635]/20 bg-[#2c561d] p-6 shadow-[0_0_35px_rgba(163,230,53,0.08)] sm:p-7"
              style={{
                backgroundColor: "#22331C",
                borderColor: "rgba(163,230,53,0.20)",
              }}
            >
              <h2 className="font-serif text-3xl font-bold text-white">
                AI Disease Detection
              </h2>

              <p className="mt-3 leading-7 text-[#1a502e]">
                Upload crop images from your crop page
                to check for supported diseases.
              </p>

              <Link
                to="/crops"
                className="mt-6 inline-block rounded-full bg-[#283513] px-6 py-3 font-semibold text-[#0A0F08] shadow-[0_0_20px_rgba(163,230,53,0.20)] transition duration-200 hover:bg-[#84CC16]"
              >
                Analyze Crop
              </Link>
            </div>

          </div>

          {/* Voice Assistant */}
          <div
            className="mt-8 rounded-2xl border border-[#A3E635]/20 bg-[#22331C] p-6 shadow-[0_0_35px_rgba(163,230,53,0.08)] sm:p-7"
            style={{
              backgroundColor: "#22331C",
              borderColor: "rgba(163,230,53,0.20)",
            }}
          >
            <h2 className="font-serif text-3xl font-bold text-white">
             Voice Assistant
            </h2>

            <p className="mt-3 leading-7 text-[#697a6f]">
              Ask the AI Farmer Assistant a question using your voice.
            </p>

            <div className="mt-6">
              <VoiceAssistant
                language={user.language}
              />
            </div>
          </div>

          {/* Coming Soon */}
          <div
            className="mt-8 rounded-2xl border border-[#A3E635]/20 bg-[#22331C] p-6 shadow-[0_0_35px_rgba(163,230,53,0.08)] sm:p-7"
            style={{
              backgroundColor: "#22331C",
              borderColor: "rgba(163,230,53,0.20)",
            }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4d602e]">
              Roadmap
            </p>

            <h2 className="mt-1 font-serif text-3xl font-bold text-white">
              Coming Next
            </h2>

            <ul className="mt-5 space-y-3 text-[#DCFCE7]">
              <li> Weather intelligence</li>
              <li> AI Farmer Assistant</li>
              <li> Agricultural knowledge and recommendations</li>
              <li> Voice interaction</li>
              <li> Expanded crop and disease support</li>
            </ul>
          </div>

        </section>
      </div>
    </div>
  );
}

export default DashboardPage;


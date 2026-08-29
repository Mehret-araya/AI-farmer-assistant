import { useAuth } from "../context/AuthContext";
import CropImageUpload from "../components/CropImageUpload";

function DashboardPage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-green-700">
          Welcome, {user.name}! 🌱
        </h1>

        <p className="mt-2 text-gray-700">
          Welcome to your AI Farmer Assistant dashboard.
        </p>

        {/* Profile */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="text-2xl font-semibold text-green-700">
            Your Profile
          </h2>

          <div className="mt-4 space-y-2">
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
              <strong>Language:</strong> {user.language}
            </p>

            <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        </div>

        {/* Image compression test */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <CropImageUpload />
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="mt-6 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;


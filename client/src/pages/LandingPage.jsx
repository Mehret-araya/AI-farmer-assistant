function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-green-700">
          AI Farmer Assistant 🌱
        </h1>

        <p className="mt-4 text-xl text-gray-700">
          AI-powered agricultural assistance for farmers.
        </p>

        <button className="mt-6 rounded-lg bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
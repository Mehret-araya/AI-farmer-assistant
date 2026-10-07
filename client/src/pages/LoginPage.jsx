
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      // Save JWT token for authenticated requests
      localStorage.setItem("token", data.token);
      setUser(data.user);

      setMessage("Login successful!");

      // Redirect to the protected dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050A08] px-6 py-12 text-[#DCFCE7]">
      <div className="w-full max-w-md rounded-3xl border border-[rgba(34,197,94,0.2)] bg-[#0F1A14] p-8 shadow-[0_0_60px_rgba(34,197,94,0.15)] md:p-10">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-wider text-[#22C55E]">
            AI Farmer Assistant
          </span>

          <h1 className="mt-3 font-serif text-4xl tracking-tight text-[#DCFCE7]">
            Welcome back.
          </h1>

          <p className="mt-3 leading-7 text-[#86EFAC]">
            Sign in to keep your farm decisions moving forward.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#DCFCE7]"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[rgba(34,197,94,0.4)] bg-[#0F1A14] px-3 py-2 text-[#DCFCE7] caret-[#22C55E] placeholder:text-[rgba(134,239,172,0.5)] outline-none focus:ring-2 focus:ring-[#22C55E]/40"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#DCFCE7]"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[rgba(34,197,94,0.4)] bg-[#0F1A14] px-3 py-2 text-[#DCFCE7] caret-[#22C55E] placeholder:text-[rgba(134,239,172,0.5)] outline-none focus:ring-2 focus:ring-[#22C55E]/40"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full border border-[#22C55E] bg-[#166534] px-6 py-3 font-semibold text-[#DCFCE7] shadow-[0_0_20px_rgba(34,197,94,0.3)] transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Sign in"}
          </button>
        </form>

        {message && (
          <p className="mt-5 rounded-xl border border-[#22C55E]/20 bg-[#166534]/30 px-4 py-3 text-sm text-[#86EFAC]">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-5 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-[#86EFAC]">
          New here?{" "}
          <a
            href="/register"
            className="font-medium text-[#86EFAC] transition hover:text-[#22C55E]"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;


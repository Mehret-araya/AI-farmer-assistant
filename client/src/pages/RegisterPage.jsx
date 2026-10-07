
import { useState } from "react";
import { registerUser } from "../api/auth";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    farmSize: "",
    language: "en",
    privacyConsent: false,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const userData = {
        ...formData,
        farmSize: Number(formData.farmSize),
      };

      const data = await registerUser(userData);

      setMessage(data.message || "Account created successfully.");

      setFormData({
        name: "",
        email: "",
        password: "",
        location: "",
        farmSize: "",
        language: "en",
        privacyConsent: false,
      });
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050A08] px-6 py-12 text-[#DCFCE7]">
      <div className="w-full max-w-2xl rounded-3xl border border-[rgba(34,197,94,0.2)] bg-[#0F1A14] p-8 shadow-[0_0_60px_rgba(34,197,94,0.15)] md:p-10">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-wider text-[#22C55E]">
            Start your field journal
          </span>

          <h1 className="mt-3 font-serif text-5xl tracking-tight text-[#DCFCE7]">
            Create your account.
          </h1>

          <p className="mt-3 leading-7 text-[#86EFAC]">
            Set up a simple home for your crops, images, and farm questions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[#DCFCE7]"
            >
              Name
            </label>
            <br />
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[rgba(34,197,94,0.4)] bg-[#0F1A14] px-3 py-2 text-[#DCFCE7] caret-[#22C55E] placeholder:text-[rgba(134,239,172,0.5)] outline-none transition focus:ring-2 focus:ring-[#22C55E]/40"
            />
          </div>

          <br />

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#DCFCE7]"
            >
              Email
            </label>
            <br />
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[rgba(34,197,94,0.4)] bg-[#0F1A14] px-3 py-2 text-[#DCFCE7] caret-[#22C55E] placeholder:text-[rgba(134,239,172,0.5)] outline-none transition focus:ring-2 focus:ring-[#22C55E]/40"
            />
          </div>

          <br />

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#DCFCE7]"
            >
              Password
            </label>
            <br />
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-xl border border-[rgba(34,197,94,0.4)] bg-[#0F1A14] px-3 py-2 text-[#DCFCE7] caret-[#22C55E] placeholder:text-[rgba(134,239,172,0.5)] outline-none transition focus:ring-2 focus:ring-[#22C55E]/40"
            />
          </div>

          <br />

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-[#DCFCE7]"
            >
              Location
            </label>
            <br />
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Addis Ababa"
              className="w-full rounded-xl border border-[rgba(34,197,94,0.4)] bg-[#0F1A14] px-3 py-2 text-[#DCFCE7] caret-[#22C55E] placeholder:text-[rgba(134,239,172,0.5)] outline-none transition focus:ring-2 focus:ring-[#22C55E]/40"
            />
          </div>

          <br />

          <div>
            <label
              htmlFor="farmSize"
              className="mb-2 block text-sm font-medium text-[#DCFCE7]"
            >
              Farm Size
            </label>
            <br />
            <input
              id="farmSize"
              name="farmSize"
              type="number"
              min="0"
              step="0.01"
              value={formData.farmSize}
              onChange={handleChange}
              placeholder="e.g. 2"
              className="w-full rounded-xl border border-[rgba(34,197,94,0.4)] bg-[#0F1A14] px-3 py-2 text-[#DCFCE7] caret-[#22C55E] placeholder:text-[rgba(134,239,172,0.5)] outline-none transition focus:ring-2 focus:ring-[#22C55E]/40"
            />
          </div>

          <br />

          <div>
            <label
              htmlFor="language"
              className="mb-2 block text-sm font-medium text-[#DCFCE7]"
            >
              Language
            </label>
            <br />

            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full rounded-xl border border-[rgba(34,197,94,0.4)] bg-[#0F1A14] px-3 py-2 text-[#DCFCE7] outline-none transition focus:ring-2 focus:ring-[#22C55E]/40"
            >
              <option value="en">English</option>
              <option value="am">Amharic</option>
              <option value="sw">Swahili</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          <br />

          <div>
            <label className="flex items-center gap-2 text-sm text-[#86EFAC]">
              <input
                type="checkbox"
                name="privacyConsent"
                checked={formData.privacyConsent}
                onChange={handleChange}
                required
                className="h-4 w-4 accent-[#22C55E]"
              />{" "}
              I agree to the{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-[#86EFAC] underline transition hover:text-[#22C55E]"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          <br />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full border border-[#22C55E] bg-[#166534] px-6 py-3 font-semibold text-[#DCFCE7] shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-colors hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {message && (
          <p className="mt-5 text-sm text-[#22C55E]">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-5 text-sm text-red-400">
            {error}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-[#86EFAC]">
          Already registered?{" "}
          <a
            href="/login"
            className="transition hover:text-[#22C55E]"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

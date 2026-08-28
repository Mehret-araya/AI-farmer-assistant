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
    <div>
      <h1>Create Your Farmer Account</h1>

      <p>Register to use AI Farmer Assistant.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <br />
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="password">Password</label>
          <br />
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <br />

        <div>
          <label htmlFor="location">Location</label>
          <br />
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Addis Ababa"
          />
        </div>

        <br />

        <div>
          <label htmlFor="farmSize">Farm Size</label>
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
          />
        </div>

        <br />

        <div>
          <label htmlFor="language">Language</label>
          <br />

          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
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
          <label>
            <input
              type="checkbox"
              name="privacyConsent"
              checked={formData.privacyConsent}
              onChange={handleChange}
              required
            />{" "}
            I agree to the{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noreferrer"
            >
              Privacy Policy
            </a>
          </label>
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {message && (
        <p style={{ color: "green" }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default RegisterPage;
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
    <div className="public-page auth-page">
      <div className="auth-card">
        <div className="auth-intro">
          <span className="eyebrow">AI Farmer Assistant</span>
          <h1>Welcome back.</h1>
          <p>Sign in to keep your farm decisions moving forward.</p>
        </div>
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="field-group">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="button button-primary button-wide" disabled={loading}>
            {loading ? "Logging in..." : "Sign in"}
          </button>
        </form>
        {message && <p className="alert alert-success">{message}</p>}
        {error && <p className="alert alert-error">{error}</p>}
        <p className="auth-footnote">New here? <a href="/register">Create an account</a></p>
      </div>
    </div>
  );
}

export default LoginPage;


import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/login", formData);
      login(response.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error?.message || "Login failed.");
    }
  };

  return (
    <div className="auth-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email (patient@example.com)"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder="Password (Passw0rd!)"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <div className="test-credentials">
        <p>
          <b>Admin:</b> admin@example.com / Passw0rd!
        </p>
        <p>
          <b>Patient:</b> register a new one or use patient@example.com /
          Passw0rd! (after registering it)
        </p>
      </div>
    </div>
  );
}
export default LoginPage;

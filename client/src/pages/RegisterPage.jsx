import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/register", formData);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error?.message || "Registration failed.");
    }
  };

  return (
    <div className="auth-page">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 chars)"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
export default RegisterPage;

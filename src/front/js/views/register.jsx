import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import AvatarSelector from "../../components/AvatarSelector";
import "../../styles/register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarSelect = (id) => {
    setFormData({
      ...formData,
      avatar: id
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: formData.avatar
      });

      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="left-panel">
        <div className="shadow-title-wrapper">
          <h1 className="shadow-title">SHADOWMAP</h1>
        </div>

        <h2 className="section-title">New Entity Acquisition</h2>

        <p className="description">
          Enter the Shadow Archive. Your presence here is an anomaly.
          We require formal indexing to synchronize your spectral
          coordinates with the central map.
        </p>
      </div>

      <div className="right-panel">
        <div className="register-box">
          <form onSubmit={handleSubmit}>
            <label>Name / Alias</label>
            <input
              type="text"
              name="name"
              placeholder="Shadow Operative"
              value={formData.name}
              onChange={handleChange}
            />

            <label>Secure Email</label>
            <input
              type="email"
              name="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleChange}
            />

            <label>Cipher Key</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />

            <label>Choose Your Avatar</label>
            <AvatarSelector
              selected={formData.avatar}
              onSelect={handleAvatarSelect}
              disabled={false}
            />

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="register-btn">
              Initiate Entry →
            </button>
          </form>

          <div className="login-link">
            <span onClick={() => navigate("/login")}>
              Already Indexed? Log In
            </span>
          </div>

          <p className="terms">
            By initiating, you agree to the VEL protocols and archival terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

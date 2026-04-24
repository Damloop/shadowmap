import React, { useState } from "react";
import { API_URL } from "../../api/config";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/register.css";

import AvatarSelector from "../component/AvatarSelector.jsx";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shortname: "",
    email: "",
    password: "",
    avatar: null
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarSelect = (avatarId) => {
    setForm({ ...form, avatar: avatarId });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const resp = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await resp.json();

    if (!resp.ok) {
      setError(data.msg || "Error al crear la cuenta");
      return;
    }

    navigate("/login");
  };

  return (
    <div className="register-wrapper">

      <div style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: "80px",
        marginTop: "40px"
      }}>

        <div style={{
          flex: 1,
          maxWidth: "420px",
          marginLeft: "60px"
        }}>
          <h1 className="shadow-title">SHADOWMAP</h1>
          <h2 className="shadow-subtitle">Registro de usuario</h2>

          <form className="sm-form" onSubmit={handleRegister}>

            {error && <div className="sm-error">{error}</div>}

            <label className="sm-label">Nombre</label>
            <input
              type="text"
              name="shortname"
              className="sm-input"
              value={form.shortname}
              onChange={handleChange}
              required
            />

            <label className="sm-label">Correo</label>
            <input
              type="email"
              name="email"
              className="sm-input"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label className="sm-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="sm-input"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="sm-btn">
              Crear cuenta
            </button>

            <Link to="/login" className="sm-link">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>

          </form>
        </div>

        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: "scale(1.15)",
          transformOrigin: "top center",
          marginTop: "10px"
        }}>
          <AvatarSelector
            onSelect={handleAvatarSelect}
            onConfirm={() => navigate("/login")}
          />
        </div>

      </div>
    </div>
  );
};

export default Register;

// src/front/js/views/register.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarSelector from "../../components/AvatarSelector";
import "../../styles/register.css";

const Register = () => {
  const navigate = useNavigate();

  const API_URL = "https://solid-goldfish-xj5599r4x942vrp4-3001.app.github.dev";

  const [formData, setFormData] = useState({
    shortname: "",
    email: "",
    password: "",
    avatar: null
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarSelect = id => {
    setFormData({
      ...formData,
      avatar: id + 1
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.shortname || formData.shortname.length > 7) {
      setError("El nombre debe tener máximo 7 caracteres.");
      return;
    }

    if (!formData.email || !formData.password) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    if (!formData.avatar) {
      setError("Debes elegir un avatar antes de continuar.");
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.shortname,   // 🔥 CORREGIDO
          avatar: formData.avatar         // 🔥 CORREGIDO
        })
      });

      const data = await resp.json().catch(() => null);

      if (!resp.ok) {
        setError(data?.msg || "No se pudo completar el registro.");
        return;
      }

      setSuccess("Identidad fijada. Redirigiendo…");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      console.error("Error en registro:", err);
      setError("Error interno del Archivo Sombrío.");
    }
  };

  return (
    <div className="register-wrapper">

      {/* LADO IZQUIERDO */}
      <div className="register-left">
        <h1 className="shadow-title">SHADOWMAP</h1>

        <p className="register-lore">
          En las capas ocultas del Mapa Sombrío, cada identidad proyecta un eco.
          Ese eco puede guiarte… o perderte.
          <br /><br />
          Elige bien: tu avatar será la forma que adopte tu presencia
          dentro de esta red de anomalías, señales y secretos.
        </p>
      </div>

      {/* LADO DERECHO */}
      <div className="register-right">
        <div className="register-box">

          {error && <div className="sm-error">{error}</div>}
          {success && <div className="sm-success">{success}</div>}

          <form onSubmit={handleSubmit} className="sm-form">

            <input
              type="text"
              name="shortname"
              placeholder="Nombre (máx 7 caracteres)"
              maxLength="7"
              className="sm-input"
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              className="sm-input"
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className="sm-input"
              onChange={handleChange}
            />

            <AvatarSelector
              onSelect={handleAvatarSelect}
              selected={formData.avatar}
            />

            <button type="submit" className="sm-btn glitch-btn">
              <span className="glitch-layer">Fijar Identidad</span>
              <span className="glitch-layer">Fijar Identidad</span>
              <span className="glitch-layer">Fijar Identidad</span>
            </button>

          </form>

          <p className="sm-link" onClick={() => navigate("/login")}>
            ¿Ya estás registrado? Acceder
          </p>

        </div>
      </div>

    </div>
  );
};

export default Register;

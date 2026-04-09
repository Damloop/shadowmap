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

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarSelect = id => {
    setFormData({
      ...formData,
      avatar: id
    });
  };

  const handleSubmit = async () => {
    setError("");

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
          shortname: formData.shortname,
          avatar: formData.avatar
        })
      });

      const data = await resp.json().catch(() => null);

      if (!resp.ok) {
        setError(data?.msg || "No se pudo completar el registro.");
        return;
      }

      navigate("/profile");

    } catch (err) {
      console.error("Error en registro:", err);
      setError("Error interno del Archivo Sombrío.");
    }
  };

  return (
    <div className="register-wrapper">

      <div className="register-left">
        <h1 className="shadow-title">SHADOWMAP</h1>

        <p className="register-lore">
          En las capas ocultas del Mapa Sombrío, cada identidad proyecta un eco.
          Ese eco puede guiarte… o perderte.
          <br /><br />
          Elige bien: tu avatar será la forma que adopte tu presencia
          dentro de esta red de anomalías, señales y secretos.
        </p>

        <div className="register-box">
          {error && <div className="sm-error">{error}</div>}

          <form className="sm-form" onSubmit={(e) => e.preventDefault()}>
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
          </form>
        </div>
      </div>

      <div className="register-right">
        <AvatarSelector
          onSelect={handleAvatarSelect}
          onConfirm={handleSubmit}
        />
      </div>

    </div>
  );
};

export default Register;

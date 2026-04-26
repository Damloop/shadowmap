import React, { useState } from "react";
import { API_URL } from "../../api/config";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/register.css";

import AvatarSelector from "../component/AvatarSelector.jsx";
import { getAvatarLore } from "../../data/avatarLore";

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

    if (!form.avatar) {
      setError("Debes elegir un avatar para continuar.");
      return;
    }

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

      {/* IZQUIERDA → FORMULARIO */}
      <div className="register-left">

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

          {/* MÁS INFO DEBAJO */}
          {form.avatar && (
            <div className="register-lore-box">
              <h4>{getAvatarLore(form.avatar).title}</h4>
              <p>{getAvatarLore(form.avatar).origin}</p>
            </div>
          )}

        </form>
      </div>

      {/* DERECHA → AVATAR */}
      <div className="register-right">
        <AvatarSelector
          onSelect={handleAvatarSelect}
          selectedAvatar={form.avatar}
        />
      </div>

    </div>
  );
};

export default Register;

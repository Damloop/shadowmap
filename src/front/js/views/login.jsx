// src/front/js/views/login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/login.css";

const Login = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    const resp = await actions.login(formData.email, formData.password);

    if (!resp.success) {
      setError(resp.message || "Acceso denegado.");
      return;
    }

    navigate("/profile");
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">

        <h1 className="login-title">SHADOWMAP</h1>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="login-input"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="login-input"
            onChange={handleChange}
          />

          <button type="submit" className="btn-entrar">
            Entrar
          </button>

        </form>

        <div className="login-links-row">
          <span className="login-link-left" onClick={() => navigate("/register")}>
            Regístrate
          </span>

          <span className="login-link-right" onClick={() => navigate("/recover")}>
            ¿Olvidaste algo?
          </span>
        </div>

      </div>
    </div>
  );
};

export default Login;

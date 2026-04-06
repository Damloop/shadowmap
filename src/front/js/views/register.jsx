import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth";
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
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: formData.avatar
      });

      navigate("/login");
    } catch (err) {
      setError(err.message || "Error en el registro");
    }
  };

  return (
    <div className="register-wrapper">

      {/* LADO IZQUIERDO */}
      <div className="register-left">
        <h1 className="shadow-title">SHADOWMAP</h1>

        <h2 className="shadow-subtitle">Registro de Nueva Entidad</h2>

        <p className="shadow-description">
          El Archivo Sombrío ha detectado tu irrupción.  
          Las capas internas registran fluctuaciones en tu huella espectral.  
          Para evitar una desestabilización del Mapa Central, tu identidad debe ser fijada,  
          clasificada y vinculada al sistema.  
          No completes este proceso si no estás dispuesto a ser observado.
        </p>
      </div>

      {/* LADO DERECHO */}
      <div className="register-right">
        <div className="register-box">

          {error && <div className="sm-error">{error}</div>}

          <form onSubmit={handleSubmit} className="sm-form">

            <label className="sm-label">Nombre / Alias</label>
            <input
              type="text"
              name="name"
              placeholder="Tu nombre o alias"
              className="sm-input"
              value={formData.name}
              onChange={handleChange}
            />

            <label className="sm-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="correo@seguro.com"
              className="sm-input"
              value={formData.email}
              onChange={handleChange}
            />

            <label className="sm-label">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="sm-input"
              value={formData.password}
              onChange={handleChange}
            />

            {/* AvatarSelector SIN TEXTO ENCIMA */}
            <AvatarSelector onSelect={handleAvatarSelect} />

            <button className="sm-btn" type="submit">
              Crear entidad
            </button>
          </form>

          <div className="sm-faint-divider"></div>

          <a href="/login" className="sm-link-muted">
            ¿Ya estás registrado? Accede al archivo
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;

// src/front/js/views/recover.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api/config";
import "../../styles/recover.css";

const Recover = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const resp = await fetch(`${API_URL}/api/recover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      // Intentar leer JSON, pero sin romper si viene vacío
      const data = await resp.json().catch(() => null);

      if (!resp.ok) {
        setMessage(data?.message || "No se pudo procesar la solicitud.");
        return;
      }

      setMessage("Solicitud enviada. Revisa tu correo si existe en el Archivo Sombrío.");
    } catch (err) {
      setMessage("Error interno del sistema.");
    }
  };

  return (
    <div className="recover-wrapper">
      <div className="recover-box">

        <h1 className="recover-title">SHADOWMAP</h1>
        <h2 className="recover-subtitle">¿Olvidaste algo?</h2>

        {message && <div className="recover-message">{message}</div>}

        <form onSubmit={handleSubmit} className="recover-form">
          <input
            type="email"
            placeholder="tu-correo@example.com"
            className="recover-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="recover-btn glitch-btn">
            <span className="glitch-layer">Enviar solicitud</span>
            <span className="glitch-layer">Enviar solicitud</span>
            <span className="glitch-layer">Enviar solicitud</span>
          </button>
        </form>

        <p className="recover-link" onClick={() => navigate("/login")}>
          ← Volver al inicio de sesión
        </p>

      </div>
    </div>
  );
};

export default Recover;

// src/front/js/views/resetPassword.jsx

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../api/config";
import "../../styles/recover.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null); // success | error

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      const resp = await fetch(`${API_URL}/api/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (resp.ok) {
        setStatus("success");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="recover-wrapper">
      <div className="recover-box">

        <h1 className="recover-title">SHADOWMAP</h1>
        <h2 className="recover-subtitle">Nueva contraseña</h2>

        {status === "success" && (
          <div className="recover-success">✔ Contraseña actualizada correctamente</div>
        )}

        {status === "error" && (
          <div className="recover-error">✖ Token inválido o expirado</div>
        )}

        <form onSubmit={handleReset} className="recover-form">
          <input
            type="password"
            placeholder="Introduce tu nueva contraseña"
            className="recover-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="recover-btn glitch-btn">
            <span className="glitch-layer">Guardar contraseña</span>
            <span className="glitch-layer">Guardar contraseña</span>
            <span className="glitch-layer">Guardar contraseña</span>
          </button>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;

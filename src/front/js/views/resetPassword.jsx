// src/front/js/views/resetPassword.jsx

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/recover.css"; // usa tu mismo estilo de recover

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const API_URL = "https://solid-goldfish-xj5599r4x942vrp4-3001.app.github.dev";

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);

  const handleReset = async e => {
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
    <div className="recover-page">

      {/* TÍTULO SHADOWMAP */}
      <h1 className="recover-title">Nueva contraseña</h1>

      <form onSubmit={handleReset}>
        <input
          type="password"
          className="recover-input"
          placeholder="Introduce tu nueva contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="recover-btn">
          Guardar contraseña
        </button>
      </form>

      {status === "success" && (
        <p className="recover-success">✔ Contraseña actualizada correctamente</p>
      )}

      {status === "error" && (
        <p className="recover-error">✖ Token inválido o expirado</p>
      )}
    </div>
  );
};

export default ResetPassword;

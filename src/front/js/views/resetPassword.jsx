// src/front/js/views/resetPassword.jsx

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../api/config";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const resp = await fetch(`${API_URL}/api/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (resp.ok) {
        setDone(true);
      } else {
        console.error("Error en reset-password, status:", resp.status);
      }
    } catch (error) {
      console.error("Error en reset-password:", error);
    }
  };

  return (
    <div className="reset-container">
      <h1>Restaurar contraseña</h1>

      {done ? (
        <div className="alert alert-success">
          Contraseña actualizada. Ya puedes iniciar sesión.
        </div>
      ) : (
        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Guardar</button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;

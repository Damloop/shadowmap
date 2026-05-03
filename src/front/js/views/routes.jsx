// src/front/js/views/routes.jsx

import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.jsx";

const RoutesPage = () => {
  const { store, actions } = useContext(Context);

  // Cargar rutas locales al entrar
  useEffect(() => {
    actions.loadSavedRoutesLocal();
  }, []);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2 style={{ marginBottom: 20 }}>Rutas guardadas</h2>

      {store.savedRoutes.length === 0 && (
        <p>No tienes rutas guardadas.</p>
      )}

      {store.savedRoutes.map((r) => (
        <div
          key={r.id}
          style={{
            background: "#1b1f2a",
            padding: 16,
            borderRadius: 10,
            marginBottom: 14,
            border: "1px solid #333"
          }}
        >
          <h3 style={{ margin: 0 }}>{r.name}</h3>
          <p style={{ opacity: 0.8 }}>{r.description}</p>
          <p>Valoración: {"⭐".repeat(r.rating || 3)}</p>
          <p>Puntos: {r.points.length}</p>
        </div>
      ))}
    </div>
  );
};

export default RoutesPage;
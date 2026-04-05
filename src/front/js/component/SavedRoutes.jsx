import React, { useContext } from "react";
import { Context } from "../store/appContext";

const SavedRoutes = () => {
  const { store } = useContext(Context);
  const routes = store.savedRoutes || [];

  return (
    <div className="routes-block">
      <h3 className="routes-title">Saved routes</h3>

      {routes.length === 0 && (
        <p className="routes-empty">No routes saved.</p>
      )}

      {routes.slice(-3).map(r => (
        <div key={r.id} className="route-card">
          <div className="route-card-header">
            <span className="route-card-name">{r.name}</span>
            <span className="route-card-rating">{"★".repeat(r.rating)}</span>
          </div>
          <p className="route-card-notes">{r.notes}</p>
        </div>
      ))}
    </div>
  );
};

export default SavedRoutes;

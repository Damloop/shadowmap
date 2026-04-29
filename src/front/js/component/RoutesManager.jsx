// src/front/js/component/RoutesManager.jsx
import React, { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "shadowmap_saved_routes";
const DRAFT_KEY = "shadowmap_route_draft";

const emptyDraft = () => ({ id: null, name: "", rating: 0, info: "", points: [] });

const RoutesManager = ({
  isCreatingRoute,
  draft,
  setDraft,
  isEditingMeta,
  setIsEditingMeta,
  onRouteSaved,
  onEditSavedRoute,
  onRouteDeleted,
  maxRoutes = 3,
}) => {
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [localDraft, setLocalDraft] = useState(draft || emptyDraft());
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setSavedRoutes(raw ? JSON.parse(raw) : []);
    } catch {
      setSavedRoutes([]);
    }
  }, []);

  useEffect(() => {
    setLocalDraft(draft || emptyDraft());
  }, [draft]);

  const persistSaved = useCallback((routes) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
    setSavedRoutes(routes);
  }, []);

  const saveDraft = () => {
    if (!localDraft.name || !localDraft.name.trim()) {
      setError("Pon un nombre a la ruta antes de guardar.");
      return;
    }
    const route = {
      ...localDraft,
      id: localDraft.id || `route-${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    const newSaved = [...savedRoutes.filter((r) => r.id !== route.id), route].slice(0, maxRoutes);
    persistSaved(newSaved);
    sessionStorage.removeItem(DRAFT_KEY);
    setLocalDraft(emptyDraft());
    setIsEditingMeta(false);
    setError("");
    if (onRouteSaved) onRouteSaved(newSaved);
  };

  const deleteSavedRoute = (id) => {
    const filtered = savedRoutes.filter((r) => r.id !== id);
    persistSaved(filtered);
    if (onRouteDeleted) onRouteDeleted(filtered);
  };

  const editSavedRoute = (id) => {
    const r = savedRoutes.find((x) => x.id === id);
    if (!r) return;
    setLocalDraft({ ...r });
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(r));
    setIsEditingMeta(true);
    if (onEditSavedRoute) onEditSavedRoute(r);
  };

  const shareRoute = (route) => {
    const summary = { id: route.id, name: route.name, info: route.info, rating: route.rating };
    try {
      navigator.clipboard?.writeText(JSON.stringify(summary));
      alert("Resumen de la ruta copiado al portapapeles.");
    } catch {
      alert("Compartir: copia manual: " + JSON.stringify(summary));
    }
  };

  const cancelEditing = () => {
    sessionStorage.removeItem(DRAFT_KEY);
    setLocalDraft(emptyDraft());
    setIsEditingMeta(false);
    if (setDraft) setDraft(emptyDraft());
  };

  useEffect(() => {
    if (setDraft) setDraft(localDraft);
    if (localDraft && (localDraft.name || localDraft.info || (localDraft.points && localDraft.points.length) || localDraft.rating)) {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(localDraft));
    } else {
      sessionStorage.removeItem(DRAFT_KEY);
    }
  }, [localDraft]);

  return (
    <div className="routes-manager">
      <h4 className="routes-title">Tus rutas</h4>

      <div className="routes-controls">
        <div className="routes-info">Guardadas: {savedRoutes.length} / {maxRoutes}</div>
      </div>

      <div className="saved-routes-list">
        {savedRoutes.length === 0 && <div className="empty">No tienes rutas guardadas.</div>}
        {savedRoutes.map((route) => (
          <div key={route.id} className="saved-route-card">
            <div className="route-header">
              <strong className="route-name">{route.name}</strong>
              <div className="route-actions">
                <button className="small-btn" onClick={() => editSavedRoute(route.id)}>Editar</button>
                <button className="small-btn" onClick={() => shareRoute(route)}>Compartir</button>
                <button className="small-btn danger" onClick={() => deleteSavedRoute(route.id)}>Borrar</button>
              </div>
            </div>
            <div className="route-meta">
              <span className="route-rating">⭐ {route.rating || 0}</span>
              <span className="route-info">{route.info || "Sin descripción"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de metadatos (aparece tras colocar puntos o al editar) */}
      {isEditingMeta && (
        <div className="meta-modal-overlay" onClick={cancelEditing}>
          <div className="meta-modal" onClick={(e) => e.stopPropagation()}>
            <h4>{savedRoutes.some(r => r.id === localDraft.id) ? "Editar ruta" : "Guardar ruta"}</h4>

            <label className="field">
              Nombre
              <input type="text" value={localDraft.name} onChange={(e) => setLocalDraft(prev => ({ ...prev, name: e.target.value }))} placeholder="Nombre de la ruta" />
            </label>

            <label className="field">
              Valoración (0-5)
              <input type="number" min="0" max="5" value={localDraft.rating} onChange={(e) => setLocalDraft(prev => ({ ...prev, rating: Number(e.target.value) }))} />
            </label>

            <label className="field">
              Información
              <textarea value={localDraft.info} onChange={(e) => setLocalDraft(prev => ({ ...prev, info: e.target.value }))} placeholder="Descripción, consejos, notas..." />
            </label>

            <div className="editor-actions">
              <button className="shadow-btn shadow-btn-main" onClick={saveDraft}>Guardar ruta</button>
              <button className="shadow-btn shadow-btn-secondary" onClick={cancelEditing}>Borrar borrador</button>
              <button className="shadow-btn shadow-btn-secondary" onClick={() => { if (localDraft && localDraft.id) shareRoute(localDraft); else setError("No hay borrador para compartir."); }}>Compartir</button>
            </div>

            {error && <div className="routes-error">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesManager;

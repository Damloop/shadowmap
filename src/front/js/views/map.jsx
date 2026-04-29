// src/front/js/views/map.jsx
import React, { useEffect, useContext, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

import MapView from "../component/MapView.jsx";
import RoutesManager from "../component/RoutesManager.jsx";
import { missions } from "../../data/missions.js";

import "../../styles/map.css";

const DRAFT_KEY = "shadowmap_route_draft";
const TUTORIAL_SEEN_KEY = "shadowmap_tutorial_seen";
const COMPLETED_KEY = "shadowmap_completed_missions";

const Map = () => {
  const { store, actions } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();

  const [activeMission, setActiveMission] = useState(null);
  const [missionPoints, setMissionPoints] = useState([]);
  const [isPlacingPoints, setIsPlacingPoints] = useState(false);
  const [isEditingMeta, setIsEditingMeta] = useState(false);

  // tutorialStep: 0 oculto, 1..4 pasos
  const [tutorialStep, setTutorialStep] = useState(() => {
    try {
      // si no existe la clave, mostramos tutorial; si existe, lo ocultamos
      return sessionStorage.getItem(TUTORIAL_SEEN_KEY) ? 0 : 1;
    } catch {
      return 1;
    }
  });

  const [draft, setDraft] = useState(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : { id: null, name: "", rating: 0, info: "", points: [] };
    } catch {
      return { id: null, name: "", rating: 0, info: "", points: [] };
    }
  });

  useEffect(() => {
    actions.loadPois?.();
    actions.loadSharedRoutes?.();
    navigator.geolocation.getCurrentPosition(
      () => actions.getUserLocation?.(),
      () => actions.getUserLocation?.(),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    const missionId = location.state?.missionId;
    if (missionId) {
      const m = missions.find((x) => x.id === missionId);
      if (m) {
        setActiveMission(m);
        sessionStorage.setItem("selectedMission", JSON.stringify(m));
        const pts = generateMissionPointsNearUser(3);
        setMissionPoints(pts);
        sessionStorage.setItem("activeMissionPoints", JSON.stringify(pts));
      }
      return;
    }
    const stored = sessionStorage.getItem("selectedMission");
    if (stored) setActiveMission(JSON.parse(stored));
    const storedPts = sessionStorage.getItem("activeMissionPoints");
    if (storedPts) setMissionPoints(JSON.parse(storedPts));
  }, [location.state]);

  // persist draft
  useEffect(() => {
    if (draft && (draft.name || draft.info || (draft.points && draft.points.length) || draft.rating)) {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } else {
      sessionStorage.removeItem(DRAFT_KEY);
    }
  }, [draft]);

  // generar puntos aleatorios cerca del usuario
  const generateMissionPointsNearUser = (count = 3) => {
    const center = store?.userLocation || { lat: 40.4168, lng: -3.7038 };
    return generateRandomPoints(center, count, 300);
  };

  const generateRandomPoints = (center, count, radiusMeters) => {
    const points = [];
    const metersToDeg = (m) => m / 111000;
    for (let i = 0; i < count; i++) {
      const r = Math.random() * radiusMeters;
      const theta = Math.random() * 2 * Math.PI;
      const dx = r * Math.cos(theta);
      const dy = r * Math.sin(theta);
      const lat = center.lat + metersToDeg(dy);
      const lng = center.lng + metersToDeg(dx) / Math.cos((center.lat * Math.PI) / 180);
      points.push({ id: `mpt-${Date.now()}-${i}`, lat, lng });
    }
    return points;
  };

  // al pulsar la misión: regenerar puntos y mostrarlos
  const handleMissionClick = (e) => {
    e?.stopPropagation();
    if (!activeMission) return;
    const pts = generateMissionPointsNearUser(3);
    setMissionPoints(pts);
    sessionStorage.setItem("activeMissionPoints", JSON.stringify(pts));
    // guardar selección actual para que Profile pueda leerla si hace falta
    sessionStorage.setItem("selectedMission", JSON.stringify(activeMission));
  };

  // marcar misión como completada manualmente
  const completeMission = (e) => {
    e?.stopPropagation();
    if (!activeMission) return;
    try {
      const raw = localStorage.getItem(COMPLETED_KEY);
      const completed = raw ? JSON.parse(raw) : [];
      if (!completed.includes(activeMission.id)) {
        completed.push(activeMission.id);
        localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
      }
    } catch {
      localStorage.setItem(COMPLETED_KEY, JSON.stringify([activeMission.id]));
    }
    // marcar en sessionStorage para reflejar inmediatamente en esta vista
    sessionStorage.setItem(COMPLETED_KEY, localStorage.getItem(COMPLETED_KEY));
    // navegar a perfil
    navigate("/profile");
  };

  const isMissionCompleted = (id) => {
    try {
      const raw = localStorage.getItem(COMPLETED_KEY);
      const completed = raw ? JSON.parse(raw) : [];
      return completed.includes(id);
    } catch {
      return false;
    }
  };

  // callbacks MapView / RoutesManager (igual que antes)
  const addPointToDraft = useCallback((point) => {
    setDraft((prev) => ({ ...prev, points: [...(prev.points || []), point] }));
  }, []);
  const removePointFromDraft = useCallback((predicate) => {
    setDraft((prev) => ({ ...prev, points: (prev.points || []).filter((p) => !predicate(p)) }));
  }, []);
  const finishPlacingPoints = useCallback(() => {
    if (!draft.points || draft.points.length === 0) {
      alert("Añade al menos un punto en el mapa antes de continuar.");
      return;
    }
    setIsEditingMeta(true);
  }, [draft.points]);

  const onRouteSaved = useCallback((savedRoutes) => {
    setDraft({ id: null, name: "", rating: 0, info: "", points: [] });
    sessionStorage.removeItem(DRAFT_KEY);
    setIsPlacingPoints(false);
    setIsEditingMeta(false);
  }, []);
  const onEditSavedRoute = useCallback((route) => {
    setDraft({ ...route });
    setIsPlacingPoints(true);
    setIsEditingMeta(true);
  }, []);
  const onRouteDeleted = useCallback((savedRoutes) => {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const exists = savedRoutes.some((r) => r.id === parsed.id);
      if (!exists) {
        sessionStorage.removeItem(DRAFT_KEY);
        setDraft({ id: null, name: "", rating: 0, info: "", points: [] });
      }
    }
  }, []);

  // tutorial controls
  const nextTutorial = () => {
    if (tutorialStep >= 1 && tutorialStep < 4) setTutorialStep(tutorialStep + 1);
    else {
      setTutorialStep(0);
      sessionStorage.setItem(TUTORIAL_SEEN_KEY, "1");
    }
  };
  const openTutorial = () => setTutorialStep(1);

  return (
    <div className="map-page-container">
      {/* Tutorial (suspense) */}
      {tutorialStep > 0 && (
        <div className="tutorial-overlay" onClick={nextTutorial} role="dialog" aria-modal="true">
          <div className="tutorial-box horror" onClick={(e) => e.stopPropagation()}>
            <div className="tutorial-header">
              <div className="neon-badge">SHADOWMAP</div>
              <button className="tutorial-close" onClick={() => { setTutorialStep(0); sessionStorage.setItem(TUTORIAL_SEEN_KEY, "1"); }}>✕</button>
            </div>

            {tutorialStep === 1 && (
              <>
                <h3 className="horror-title">No estás solo</h3>
                <p className="horror-big">Sigue la misión o traza tu propio camino. Cada decisión deja una huella.</p>
                <p className="horror-line typewriter">Elige con cuidado. Algunas rutas susurran cuando cae la noche.</p>
                <div className="tutorial-actions">
                  <button className="shadow-btn shadow-btn-main" onClick={nextTutorial}>Seguir</button>
                  <button className="shadow-btn shadow-btn-secondary" onClick={() => { setTutorialStep(0); sessionStorage.setItem(TUTORIAL_SEEN_KEY, "1"); }}>Cerrar</button>
                </div>
              </>
            )}

            {tutorialStep === 2 && (
              <>
                <h3 className="horror-title">Aceptar la misión</h3>
                <p className="horror-big">Pulsa el recuadro de la misión para recibir puntos cercanos a tu ubicación.</p>
                <div className="tutorial-actions">
                  <button className="shadow-btn shadow-btn-main" onClick={nextTutorial}>Siguiente</button>
                </div>
              </>
            )}

            {tutorialStep === 3 && (
              <>
                <h3 className="horror-title">Explora por tu cuenta</h3>
                <p className="horror-big">Crea hasta 3 rutas, nómbralas y compártelas con quien confíes.</p>
                <div className="tutorial-actions">
                  <button className="shadow-btn shadow-btn-main" onClick={nextTutorial}>Siguiente</button>
                </div>
              </>
            )}

            {tutorialStep === 4 && (
              <>
                <h3 className="horror-title">Confirmar misión</h3>
                <p className="horror-big">Marca la misión como completada manualmente cuando lo hayas hecho; te llevará a tu perfil.</p>
                <div className="tutorial-actions">
                  <button className="shadow-btn shadow-btn-main" onClick={nextTutorial}>Empezar</button>
                </div>
              </>
            )}

            <div className="tutorial-footer">
              <span className="sparkle">•</span>
              <span className="tip">Pulsa <strong>?</strong> para ver esto otra vez.</span>
            </div>
          </div>
        </div>
      )}

      <button className="tutorial-quick-btn" onClick={openTutorial} aria-label="Mostrar tutorial">?</button>

      <div className="map-left-panel">
        <h2 className="panel-title">SHADOWMAP</h2>

        {/* Misión arriba */}
        {activeMission ? (
          <div
            className={`mission-box ${isMissionCompleted(activeMission.id) ? "mission-completed" : ""}`}
            role="region"
            aria-label="Misión activa"
            onClick={handleMissionClick}
            style={{ cursor: "pointer" }}
          >
            <h3>Misión activa</h3>
            <p className="mission-name">{activeMission.name}</p>
            <p className="mission-desc">{activeMission.description}</p>
            <p className="mission-diff">Dificultad: {activeMission.difficulty}</p>

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button
                className="shadow-btn shadow-btn-secondary"
                onClick={(e) => { e.stopPropagation(); completeMission(); }}
                title="Marcar misión como completada y ver en perfil"
              >
                ✔ Confirmar completada
              </button>
            </div>

            <div className="mission-aura" />
          </div>
        ) : (
          <div className="mission-box empty">
            <p>No hay misión activa</p>
          </div>
        )}

        {/* Crear ruta debajo */}
        <div className="panel-buttons">
          <button className="shadow-btn shadow-btn-main pulse-btn" onClick={() => { setIsPlacingPoints(true); setIsEditingMeta(false); }}>
            Crear nueva ruta
          </button>
        </div>

        {/* Quick actions */}
        {isPlacingPoints && !isEditingMeta && (
          <div className="panel-buttons">
            <button className="shadow-btn shadow-btn-secondary" onClick={finishPlacingPoints}>
              Terminar y editar detalles
            </button>
            <button className="shadow-btn shadow-btn-secondary" onClick={() => { setIsPlacingPoints(false); setDraft({ id: null, name: "", rating: 0, info: "", points: [] }); }}>
              Cancelar
            </button>
          </div>
        )}

        <RoutesManager
          isCreatingRoute={isPlacingPoints}
          draft={draft}
          setDraft={setDraft}
          isEditingMeta={isEditingMeta}
          setIsEditingMeta={setIsEditingMeta}
          onRouteSaved={onRouteSaved}
          onEditSavedRoute={onEditSavedRoute}
          onRouteDeleted={onRouteDeleted}
          maxRoutes={3}
        />

        <div style={{ marginTop: 8 }}>
          <button className="shadow-btn shadow-btn-secondary" onClick={() => navigate("/profile")}>Volver</button>
        </div>
      </div>

      <div className="map-right-panel">
        <MapView
          activeMission={activeMission}
          missionPoints={missionPoints}
          isCreatingRoute={isPlacingPoints}
          setIsCreatingRoute={setIsPlacingPoints}
          draftPoints={draft.points}
          addPointToDraft={addPointToDraft}
          removePointFromDraft={removePointFromDraft}
          onFinishPlacing={finishPlacingPoints}
        />
      </div>
    </div>
  );
};

export default Map;

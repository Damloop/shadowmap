// src/front/js/views/map.jsx

import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.jsx";
import MapView from "../component/MapView.jsx";
import { TutorialOverlay } from "../component/TutorialOverlay.jsx";
import "../../styles/map.css";

const MapPage = () => {
  const { store, actions } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();

  const missionFromState = location.state?.mission || null;
  const missionFromSession = (() => {
    try {
      const raw = sessionStorage.getItem("selectedMission");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const mission = missionFromState || missionFromSession || store.activeMission;

  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem("tutorialDone_map");
  });

  const handleNextTutorial = () => {
    if (tutorialStep < 2) setTutorialStep(tutorialStep + 1);
    else {
      localStorage.setItem("tutorialDone_map", "true");
      setShowTutorial(false);
    }
  };

  const [isCreatingRoute, setIsCreatingRoute] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [editingRouteId, setEditingRouteId] = useState(null);

  const handleMissionMode = () => {
    setIsCreatingRoute(false);
    actions.clearSelectedPoints();

    if (!mission) return;

    actions.setActiveMission(mission);

    if (store.userLocation) {
      const { lat, lng } = store.userLocation;
      actions.generateMissionPoint([lat, lng]);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          actions.getUserLocation();
          actions.generateMissionPoint([coords.lat, coords.lng]);
        },
        () => {}
      );
    }
  };

  const handleRouteMode = () => {
    setIsCreatingRoute(true);
    setSelectedRoute(null);
    setEditingRouteId(null);
    actions.clearSelectedPoints();
    if (!store.userLocation) actions.getUserLocation();
    if (actions?.clearMissionPoint) actions.clearMissionPoint();
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const handleCompleteMission = () => {
    if (!mission) return;
    actions.completeMission(mission.id);
    navigate("/profile");
  };

  const [showRouteModal, setShowRouteModal] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [routeInfo, setRouteInfo] = useState("");
  const [routeRating, setRouteRating] = useState(3);

  const openRouteModal = () => {
    if (!store.selectedPoints || store.selectedPoints.length < 1) {
      alert("Añade al menos un punto en el mapa.");
      return;
    }
    setRouteName("");
    setRouteInfo("");
    setRouteRating(3);
    setEditingRouteId(null);
    setShowRouteModal(true);
  };

  const saveRoute = () => {
    if (!routeName.trim()) {
      alert("Pon un nombre a la ruta.");
      return;
    }

    if (editingRouteId) {
      actions.editRoute(editingRouteId, {
        name: routeName,
        description: routeInfo,
        rating: Number(routeRating)
      });
    } else {
      const newRoute = {
        id: Date.now().toString(),
        name: routeName,
        description: routeInfo,
        rating: Number(routeRating),
        points: store.selectedPoints,
        createdAt: new Date().toISOString()
      };
      actions.saveRouteLocal(newRoute);
    }

    setShowRouteModal(false);
    setIsCreatingRoute(false);
    setEditingRouteId(null);
    actions.clearSelectedPoints();
  };

  useEffect(() => {
    actions.loadSavedRoutesLocal();
  }, []);

  return (
    <div className="map-page-container">

      {showTutorial && (
        <TutorialOverlay
          step={tutorialStep}
          onNext={handleNextTutorial}
          onClose={() => {
            localStorage.setItem("tutorialDone_map", "true");
            setShowTutorial(false);
          }}
        />
      )}

      <div className="map-left-panel">
        <h2 className="panel-title">SHADOWMAP - Mapa de Exloración Paranormal</h2>

        {!isCreatingRoute && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              className="shadow-btn shadow-btn-main pulse-btn"
              onClick={handleRouteMode}
            >
              Mis rutas
            </button>

            <button
              className="shadow-btn shadow-btn-main pulse-btn"
              onClick={handleMissionMode}
            >
              Misión activa
            </button>

            <button
              className="shadow-btn"
              onClick={() => navigate("/profile")}
            >
              Volver
            </button>
          </div>
        )}

        {/* MODO CREAR RUTA */}
        {isCreatingRoute && (
          <div className="route-buttons">

            <button className="shadow-btn shadow-btn-main" onClick={openRouteModal}>
              Crear
            </button>

            <button className="shadow-btn" onClick={openRouteModal}>
              Guardar
            </button>

            {/* ✔ BOTÓN BORRAR */}
            <button
              className="shadow-btn"
             
              onClick={() => {
                actions.clearSelectedPoints();
                setSelectedRoute(null);
              }}
            >
              Borrar
            </button>

            <button
              className="shadow-btn"
              onClick={() => {
                actions.clearSelectedPoints();
                setIsCreatingRoute(false);
                setSelectedRoute(null);
                setEditingRouteId(null);
              }}
            >
              Volver
            </button>

          </div>
        )}

      </div>

      <div className="map-right-panel">
        <MapView isCreatingRoute={isCreatingRoute} />
      </div>

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <button className="confirm-close" onClick={() => setShowConfirm(false)}>
              ×
            </button>

            <h3 className="confirm-title">¿Estás seguro?</h3>
            <p className="confirm-text">Vas a marcar la misión como completada.</p>

            <div className="confirm-buttons">
              <button className="confirm-yes" onClick={handleCompleteMission}>
                Sí, completar
              </button>
              <button className="confirm-no" onClick={() => setShowConfirm(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showRouteModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <h3>Ruta tenebrosa</h3>

            <label>Nombre</label>
            <input value={routeName} onChange={e => setRouteName(e.target.value)} />

            <label>Descripción</label>
            <textarea value={routeInfo} onChange={e => setRouteInfo(e.target.value)} rows={3} />

            <label>Valoración</label>
            <select value={routeRating} onChange={e => setRouteRating(Number(e.target.value))}>
              <option value={1}>⭐</option>
              <option value={2}>⭐⭐</option>
              <option value={3}>⭐⭐⭐</option>
              <option value={4}>⭐⭐⭐⭐</option>
              <option value={5}>⭐⭐⭐⭐⭐</option>
            </select>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="shadow-btn shadow-btn-main" onClick={saveRoute} style={{ flex: 1 }}>
                Guardar
              </button>

              <button
                className="shadow-btn"
                onClick={() => {
                  setShowRouteModal(false);
                  setEditingRouteId(null);
                }}
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MapPage;

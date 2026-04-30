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

  const mission = location.state?.mission || store.activeMission;

  const [isCreatingRoute, setIsCreatingRoute] = useState(false);

  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  const closeTutorial = () => setShowTutorial(false);

  const nextTutorial = () => {
    if (tutorialStep < 2) setTutorialStep(tutorialStep + 1);
    else closeTutorial();
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
    setShowRouteModal(true);
  };

  const saveRoute = () => {
    if (!routeName.trim()) {
      alert("Pon un nombre a la ruta.");
      return;
    }

    const newRoute = {
      id: Date.now().toString(),
      name: routeName,
      description: routeInfo,
      rating: Number(routeRating),
      points: store.selectedPoints,
      createdAt: new Date().toISOString()
    };

    actions.saveRouteLocal(newRoute);
    setShowRouteModal(false);
  };

  // 🔥 MISIÓN ACTIVA → TUTORIAL + GENERAR PUNTO
  const triggerMission = () => {
    setTutorialStep(0);
    setShowTutorial(true);

    if (!mission) return;

    actions.setActiveMission(mission);

    if (store.userLocation) {
      const { lat, lng } = store.userLocation;
      actions.generateMissionPoint([lat, lng]);
      return;
    }

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
  };

  const completeMission = () => {
    const confirm = window.confirm(
      "Si completas la misión ya no podrás volver a ella.\n¿Quieres continuar?"
    );
    if (!confirm) return;

    const resp = actions.completeMission(mission.id);
    alert(resp.message);
  };

  useEffect(() => {
    actions.loadSavedRoutesLocal();
  }, []);

  useEffect(() => {
    if (store.selectedPoints.length === 5) {
      const ok = window.confirm(
        "Tienes los cinco puntos máximos.\n¿Deseas guardar la ruta ahora?"
      );
      if (ok) openRouteModal();
    }
  }, [store.selectedPoints.length]);

  const goBack = () => {
    if (isCreatingRoute) {
      setIsCreatingRoute(false);
      return;
    }
    navigate(-1);
  };

  const handleCreateRoute = () => {
    actions.clearSelectedPoints();
    setIsCreatingRoute(true);
    setTutorialStep(2);
    setShowTutorial(true);
  };

  const handleMisRutasTutorial = () => {
    setTutorialStep(1);
    setShowTutorial(true);
    setIsCreatingRoute(true);
  };

  return (
    <div className="map-page-container">

      {showTutorial && (
        <TutorialOverlay
          step={tutorialStep}
          onNext={nextTutorial}
          onClose={closeTutorial}
        />
      )}

      <div className="map-left-panel">
        <h2 className="panel-title">SHADOWMAP - Mapa de Exploración Paranormal</h2>

        <button
          className="shadow-btn shadow-btn-main pulse-btn"
          onClick={handleMisRutasTutorial}
        >
          Mis rutas
        </button>

        {isCreatingRoute && (
          <div className="route-buttons">

            <button
              className="shadow-btn shadow-btn-main"
              onClick={handleCreateRoute}
            >
              Crear nueva ruta (máx 5 puntos)
            </button>

            <button className="shadow-btn" onClick={openRouteModal}>
              Guardar ruta
            </button>

            <button className="shadow-btn">Compartir ruta</button>

            <h3 style={{ marginTop: 15 }}>Rutas guardadas</h3>

            <div className="saved-routes-list">
              {store.savedRoutes.length === 0 && (
                <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                  No tienes rutas guardadas.
                </p>
              )}

              {store.savedRoutes.slice(0, 3).map(r => (
                <div key={r.id} className="saved-route-card route-highlight">

                  <div className="route-title">{r.name}</div>
                  <div className="route-desc">{r.description}</div>

                  <div className="route-meta">
                    <span className="route-rating">⭐ {r.rating}</span>
                    <span className="route-date">
                      {new Date(r.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="route-actions">
                    <button className="route-action-btn" onClick={() => actions.editRoute(r.id)}>Editar</button>
                    <button className="route-action-btn" onClick={() => actions.deleteRoute(r.id)}>Eliminar</button>
                    <button className="route-action-btn" onClick={() => actions.shareRoute(r.id)}>Compartir</button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {!isCreatingRoute && mission && (
          <div className="mission-box pulse-btn" onClick={triggerMission}>
            <h3>Misión activa</h3>
            <div className="mission-name">{mission.name}</div>
            <div className="mission-desc">{mission.description}</div>
            <div className="mission-diff">Dificultad: {mission.difficulty}</div>

            <button className="shadow-btn shadow-btn-main" onClick={completeMission}>
              Completar misión
            </button>
          </div>
        )}

        <button className="shadow-btn" style={{ marginTop: 20 }} onClick={goBack}>
          Volver
        </button>

      </div>

      <div className="map-right-panel">
        <MapView isCreatingRoute={isCreatingRoute} />
      </div>

      {showRouteModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <h3>Guardar ruta</h3>

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

            <div className="modal-buttons">
              <button className="shadow-btn shadow-btn-main" onClick={saveRoute}>Guardar</button>
              <button className="shadow-btn" onClick={() => setShowRouteModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MapPage;

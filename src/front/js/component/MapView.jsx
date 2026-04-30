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
  const [tutorialMode, setTutorialMode] = useState("mission");

  const [showRouteModal, setShowRouteModal] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [routeInfo, setRouteInfo] = useState("");
  const [routeRating, setRouteRating] = useState(3);
  const [editingRouteId, setEditingRouteId] = useState(null);

  const closeTutorial = () => setShowTutorial(false);

  const nextTutorial = () => {
    const maxSteps = tutorialMode === "routes" ? 1 : 1;
    if (tutorialStep < maxSteps) setTutorialStep(tutorialStep + 1);
    else closeTutorial();
  };

  // ⭐⭐⭐ Misión activa → obtener ubicación REAL o fallback + punto a 50m ⭐⭐⭐
  const triggerMission = () => {
    setTutorialMode("mission");
    setTutorialStep(0);
    setShowTutorial(true);

    if (!mission) return;

    actions.setActiveMission(mission);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        actions.setUserLocation({ lat, lng });

        // Generar punto aleatorio en un radio de 50 metros
        const radius = 50;
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * radius;

        const offsetLat = (distance * Math.cos(angle)) / 111320;
        const offsetLng =
          (distance * Math.sin(angle)) /
          (111320 * Math.cos(lat * (Math.PI / 180)));

        const finalLat = lat + offsetLat;
        const finalLng = lng + offsetLng;

        actions.generateMissionPoint([finalLat, finalLng]);
      },

      // ❗ FALLBACK: si falla la ubicación → generar punto igualmente a 50m
      () => {
        const baseLat = 40.4168; // Madrid centro
        const baseLng = -3.7038;

        const radius = 50;
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * radius;

        const offsetLat = (distance * Math.cos(angle)) / 111320;
        const offsetLng =
          (distance * Math.sin(angle)) /
          (111320 * Math.cos(baseLat * (Math.PI / 180)));

        const finalLat = baseLat + offsetLat;
        const finalLng = baseLng + offsetLng;

        actions.setUserLocation({ lat: finalLat, lng: finalLng });
        actions.generateMissionPoint([finalLat, finalLng]);

        alert("No se pudo obtener tu ubicación. Se generó un punto aleatorio a 50 metros.");
      }
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
    setEditingRouteId(null);
    setIsCreatingRoute(true);
    setShowTutorial(false);
    alert("Haz clic en el mapa para añadir puntos a tu ruta (máx 5).");
  };

  const handleMisRutasTutorial = () => {
    setTutorialMode("routes");
    setTutorialStep(0);
    setShowTutorial(true);
    setIsCreatingRoute(true);
  };

  const openRouteModal = () => {
    if (!store.selectedPoints || store.selectedPoints.length < 1) {
      alert("Añade al menos un punto en el mapa.");
      return;
    }
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
        rating: routeRating,
        points: store.selectedPoints
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

    setEditingRouteId(null);
    setShowRouteModal(false);
  };

  const startEditingRoute = (route) => {
    actions.loadRouteToEditor(route.id);
    setRouteName(route.name);
    setRouteInfo(route.description);
    setRouteRating(route.rating);
    setEditingRouteId(route.id);
    setIsCreatingRoute(true);
    setShowRouteModal(true);
  };

  return (
    <div className="map-page-container">

      {showTutorial && (
        <TutorialOverlay
          step={tutorialStep}
          onNext={nextTutorial}
          onClose={closeTutorial}
          mode={tutorialMode}
        />
      )}

      <div className="map-left-panel" style={{ position: "relative" }}>
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

            <button
              className="shadow-btn"
              onClick={() => actions.clearSelectedPoints()}
            >
              Borrar ruta
            </button>

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
                    <button
                      className="route-action-btn"
                      onClick={() => startEditingRoute(r)}
                    >
                      Editar
                    </button>

                    <button
                      className="route-action-btn"
                      onClick={() => actions.deleteRoute(r.id)}
                    >
                      Eliminar
                    </button>

                    <button
                      className="route-action-btn"
                      onClick={() => actions.shareRoute(r.id)}
                    >
                      Compartir
                    </button>
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

        {/* ⭐⭐⭐ Botón Volver fijo ⭐⭐⭐ */}
        <button
          className="shadow-btn"
          onClick={goBack}
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            width: "calc(100% - 40px)"
          }}
        >
          Volver
        </button>

      </div>

      <div className="map-right-panel">
        <MapView isCreatingRoute={isCreatingRoute} />
      </div>

      {/* ⭐⭐⭐ POPUP PREMIUM ⭐⭐⭐ */}
      {store.allMissionsCompleted && (
        <div className="premium-popup-bg">
          <div className="premium-popup-box">
            <h2 className="premium-title">¡Has completado todas las misiones!</h2>
            <p className="premium-text">
              Tu potencial es increíble. Desbloquea el <strong>Plan Premium</strong> y continúa tu ascenso en ShadowMap.
            </p>

            <button
              className="shadow-btn shadow-btn-main"
              onClick={() => navigate("/premium")}
            >
              Ver Plan Premium
            </button>

            <button
              className="shadow-btn"
              onClick={() => actions.setStore({ allMissionsCompleted: false })}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showRouteModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <h3>{editingRouteId ? "Editar ruta" : "Guardar ruta"}</h3>

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
              <button className="shadow-btn shadow-btn-main" onClick={saveRoute}>
                {editingRouteId ? "Guardar cambios" : "Guardar"}
              </button>
              <button className="shadow-btn" onClick={() => setShowRouteModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MapPage;

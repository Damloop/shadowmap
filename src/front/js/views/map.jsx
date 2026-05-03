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
    if (tutorialStep < 2) {
      setTutorialStep(tutorialStep + 1);
    } else {
      localStorage.setItem("tutorialDone_map", "true");
      setShowTutorial(false);
    }
  };

  const [isCreatingRoute, setIsCreatingRoute] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleMissionMode = () => {
    setIsCreatingRoute(false);

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
    setIsCreatingRoute(false);
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
              className="shadow-btn pulse-btn"
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

        {isCreatingRoute && (
          <div className="route-buttons">
            <button className="shadow-btn shadow-btn-main" onClick={openRouteModal}>
              Crear
            </button>
            <button className="shadow-btn" onClick={openRouteModal}>
              Guardar
            </button>
            <button className="shadow-btn">Compartir</button>
            <button className="shadow-btn">Compartidas conmigo</button>

            <button
              className="shadow-btn"
              onClick={() => {
                actions.clearSelectedPoints();
                setIsCreatingRoute(false);
              }}
            >
              Volver
            </button>
          </div>
        )}

        {isCreatingRoute && store.savedRoutes.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3 style={{ color: "#b38bff", marginBottom: 10 }}>Tus rutas guardadas</h3>

            {store.savedRoutes.slice(0, 3).map((r) => {
              const rating = Number(r.rating) || 1;
              const fecha = new Date(r.createdAt);

              return (
                <div key={r.id} style={{ marginBottom: 10 }}>

                  <div
                    onClick={() => setSelectedRoute(r.id)}
                    style={{
                      background: "#1b1f2a",
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #333",
                      fontSize: 12,
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ fontWeight: "bold", color: "white", fontSize: 13 }}>
                      {r.name}
                    </div>

                    <div style={{ opacity: 0.7 }}>{r.description}</div>

                    <div style={{ marginTop: 4 }}>
                      {"⭐".repeat(rating)}
                    </div>

                    <div style={{ opacity: 0.5, fontSize: 11, marginTop: 4 }}>
                      {fecha.toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}{" "}
                      -{" "}
                      {fecha.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>

                    <div style={{ opacity: 0.5 }}>{r.points.length} puntos</div>
                  </div>

                  {selectedRoute === r.id && (
                    <div
                      style={{
                        background: "#2a2340",
                        border: "1px solid #444",
                        borderRadius: 6,
                        padding: 8,
                        marginTop: 6,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6
                      }}
                    >
                      <button
                        className="shadow-btn"
                        style={{ padding: "4px 6px", fontSize: 12 }}
                        onClick={() => {
                          setRouteName(r.name);
                          setRouteInfo(r.description);
                          setRouteRating(r.rating);
                          setShowRouteModal(true);
                        }}
                      >
                        Editar
                      </button>

                      <button
                        className="shadow-btn"
                        style={{ padding: "4px 6px", fontSize: 12 }}
                        onClick={() => alert("Compartir próximamente")}
                      >
                        Compartir
                      </button>

                      <button
                        className="shadow-btn"
                        style={{
                          padding: "4px 6px",
                          fontSize: 12,
                          background: "#a30000"
                        }}
                        onClick={() => {
                          actions.deleteSavedRouteLocal(r.id);
                          setSelectedRoute(null);
                        }}
                      >
                        Eliminar
                      </button>

                      <button
                        className="shadow-btn"
                        style={{ padding: "4px 6px", fontSize: 12 }}
                        onClick={() => setSelectedRoute(null)}
                      >
                        Cerrar
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        {!isCreatingRoute && mission && (
          <div className="mission-box">
            <div className="mission-aura"></div>

            <h3>Misión activa</h3>
            <div className="mission-name">{mission.name}</div>
            <div className="mission-desc">{mission.description}</div>
            <div className="mission-diff">
              Dificultad: {mission.difficulty}
            </div>

            <button
              className="shadow-btn shadow-btn-main pulse-btn"
              onClick={() => setShowConfirm(true)}
            >
              Confirmar completada
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
            <p className="confirm-text">
              Vas a marcar la misión como completada.  
              Esta acción actualizará tu perfil y bloqueará esta misión.
            </p>

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

            <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "space-between" }}>
              <button
                className="shadow-btn shadow-btn-main"
                onClick={saveRoute}
                style={{ flex: 1 }}
              >
                Guardar
              </button>

              <button
                className="shadow-btn"
                onClick={() => setShowRouteModal(false)}
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
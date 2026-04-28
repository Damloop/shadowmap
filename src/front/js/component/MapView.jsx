// src/front/js/component/MapView.jsx

import React, { useEffect, useContext, useRef, useMemo, useState } from "react";
import { Context } from "../store/appContext.jsx";
import { API_URL } from "../../api/config.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import greenMarker from "../../img/markers/green-marker.png";
import redMarker from "../../img/markers/red-marker.png";

const PROXIMITY_METERS = 60;

const MapView = ({ activeMission: propMission }) => {
  const { store, actions } = useContext(Context);
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  const poiMarkers = useRef([]);
  const missionMarkers = useRef([]);
  const userMarker = useRef(null);
  const tempRouteMarkers = useRef([]);

  const [preparedMission, setPreparedMission] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCharacteristics, setFormCharacteristics] = useState("");
  const [publishAfterSave, setPublishAfterSave] = useState(false);

  // Toast for permission denied
  const [showLocationDeniedToast, setShowLocationDeniedToast] = useState(false);

  const greenIcon = useMemo(
    () =>
      L.icon({
        iconUrl: greenMarker,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      }),
    []
  );

  const redIcon = useMemo(
    () =>
      L.icon({
        iconUrl: redMarker,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      }),
    []
  );

  // Solicitar ubicación de forma robusta y detectar estado denied
  useEffect(() => {
    const requestLocation = async () => {
      if (!navigator.geolocation) return;

      // Preferir acción del store si existe
      if (actions?.getUserLocation) {
        try {
          actions.getUserLocation();
        } catch (err) {}
      }

      // Usar Permissions API si está disponible para detectar denied/prompt/granted
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const status = await navigator.permissions.query({ name: "geolocation" });
          if (status.state === "denied") {
            setShowLocationDeniedToast(true);
            return;
          }
          // Si prompt o granted, llamar para forzar prompt si corresponde
          navigator.geolocation.getCurrentPosition(
            pos => {
              // si la acción existe, la usamos para sincronizar store
              if (actions?.getUserLocation) {
                try {
                  actions.getUserLocation();
                } catch (err) {}
              } else {
                try {
                  sessionStorage.setItem("userLocationTemp", JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }));
                } catch (err) {}
              }
            },
            err => {
              if (err && err.code === 1) {
                // PERMISSION_DENIED
                setShowLocationDeniedToast(true);
              }
            }
          );
          // escuchar cambios de permiso para actualizar toast dinámicamente
          status.onchange = () => {
            if (status.state === "denied") setShowLocationDeniedToast(true);
            else setShowLocationDeniedToast(false);
          };
        } else {
          // Sin Permissions API: llamar directamente (esto debería disparar prompt)
          navigator.geolocation.getCurrentPosition(
            pos => {
              if (actions?.getUserLocation) {
                try {
                  actions.getUserLocation();
                } catch (err) {}
              } else {
                try {
                  sessionStorage.setItem("userLocationTemp", JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }));
                } catch (err) {}
              }
            },
            err => {
              if (err && err.code === 1) setShowLocationDeniedToast(true);
            }
          );
        }
      } catch (err) {
        // fallback directo
        try {
          navigator.geolocation.getCurrentPosition(
            pos => {
              if (actions?.getUserLocation) actions.getUserLocation();
            },
            e => {
              if (e && e.code === 1) setShowLocationDeniedToast(true);
            }
          );
        } catch (e) {}
      }
    };

    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (mapRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, { zoomControl: false }).setView(
      [40.4168, -3.7038],
      13
    );

    L.tileLayer(
      "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
      { maxZoom: 19 }
    ).addTo(map);

    map.on("click", (e) => {
      if (actions?.addPointToRoute) {
        try {
          actions.addPointToRoute(e.latlng.lat, e.latlng.lng);
        } catch (err) {}
      }
    });

    mapRef.current = map;

    setTimeout(() => {
      try {
        map.invalidateSize();
      } catch (err) {}
    }, 120);

    const onResize = () => {
      try {
        map.invalidateSize();
      } catch (err) {}
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      try {
        map.remove();
      } catch (err) {}
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions]);

  // Generador de misión cerca de ubicación base
  const generateMissionNear = (template, baseLat, baseLng) => {
    if (!template) return null;

    if (template.type === "reach_point" && template.target) {
      if (typeof template.target.lat === "number" && typeof template.target.lng === "number") {
        return {
          ...template,
          preparedCheckpoints: [{ lat: template.target.lat, lng: template.target.lng }]
        };
      } else {
        const tLat = baseLat + (template.target.latOffset || 0);
        const tLng = baseLng + (template.target.lngOffset || 0);
        return {
          ...template,
          preparedCheckpoints: [{ lat: tLat, lng: tLng }]
        };
      }
    }

    if (template.type === "multi_checkpoint" && Array.isArray(template.checkpoints)) {
      const prepared = template.checkpoints.map(cp => {
        if (typeof cp.lat === "number" && typeof cp.lng === "number") {
          return { lat: cp.lat, lng: cp.lng };
        }
        return {
          lat: baseLat + (cp.latOffset || (Math.random() - 0.5) * 0.002),
          lng: baseLng + (cp.lngOffset || (Math.random() - 0.5) * 0.002)
        };
      });
      return { ...template, preparedCheckpoints: prepared };
    }

    const count = template?.checkpoints?.length || 3;
    const prepared = Array.from({ length: count }).map(() => {
      const lat = baseLat + (Math.random() - 0.5) * 0.002;
      const lng = baseLng + (Math.random() - 0.5) * 0.002;
      return { lat, lng };
    });

    return { ...template, preparedCheckpoints: prepared };
  };

  // Preparar misión cuando tengamos ubicación o propMission
  useEffect(() => {
    const loc = store?.userLocation || (() => {
      try {
        const s = sessionStorage.getItem("userLocationTemp");
        return s ? JSON.parse(s) : null;
      } catch (err) {
        return null;
      }
    })();

    if (!loc) return;

    let mission = propMission;
    if (!mission) {
      try {
        const stored = sessionStorage.getItem("selectedMission");
        if (stored) mission = JSON.parse(stored);
      } catch (err) {
        mission = null;
      }
    }

    if (!mission) {
      setPreparedMission(null);
      return;
    }

    const prepared = generateMissionNear(mission, loc.lat, loc.lng);
    setPreparedMission(prepared);
    setCompletedCount(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propMission, store?.userLocation]);

  // Renderizar marcadores de misión
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !preparedMission) return;

    missionMarkers.current.forEach(m => {
      try {
        if (m && map.hasLayer && map.hasLayer(m)) map.removeLayer(m);
      } catch (err) {}
    });
    missionMarkers.current = [];

    const checkpoints = preparedMission.preparedCheckpoints || [];
    checkpoints.forEach((pt, idx) => {
      try {
        const marker = L.marker([pt.lat, pt.lng], { icon: redIcon }).addTo(map);
        marker._checkpointIndex = idx;
        missionMarkers.current.push(marker);
      } catch (err) {}
    });

    const focus = checkpoints[0] || (store?.userLocation && { lat: store.userLocation.lat, lng: store.userLocation.lng });
    if (focus) {
      try {
        map.setView([focus.lat, focus.lng], 15);
      } catch (err) {}
    }

    setTimeout(() => {
      try {
        map.invalidateSize();
      } catch (err) {}
    }, 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preparedMission, redIcon, store?.userLocation]);

  // Cargar POIs
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let cancelled = false;

    const loadPOIs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/pois`);
        if (!response.ok) return;
        const data = await response.json();
        if (cancelled) return;

        poiMarkers.current.forEach(m => {
          try {
            if (m && map.hasLayer && map.hasLayer(m)) map.removeLayer(m);
          } catch (err) {}
        });
        poiMarkers.current = [];

        data.forEach(poi => {
          try {
            const marker = L.marker([poi.lat, poi.lng], { icon: greenIcon }).addTo(map);
            poiMarkers.current.push(marker);
          } catch (err) {}
        });
      } catch (err) {}
    };

    loadPOIs();

    return () => {
      cancelled = true;
      poiMarkers.current.forEach(m => {
        try {
          if (m && map.hasLayer && map.hasLayer(m)) map.removeLayer(m);
        } catch (err) {}
      });
      poiMarkers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [greenIcon]);

  // Actualizar marcador de usuario
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !store?.userLocation) return;

    const { lat, lng } = store.userLocation;

    if (userMarker.current) {
      try {
        if (map.hasLayer && map.hasLayer(userMarker.current)) map.removeLayer(userMarker.current);
      } catch (err) {}
      userMarker.current = null;
    }

    const icon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    try {
      userMarker.current = L.marker([lat, lng], { icon }).addTo(map);
    } catch (err) {}

    setTimeout(() => {
      try {
        map.invalidateSize();
      } catch (err) {}
    }, 80);
  }, [store?.userLocation]);

  // Renderizar marcadores de ruta en curso (selectedPoints)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    tempRouteMarkers.current.forEach(m => {
      try {
        if (m && map.hasLayer && map.hasLayer(m)) map.removeLayer(m);
      } catch (err) {}
    });
    tempRouteMarkers.current = [];

    const points = store?.selectedPoints || [];
    points.forEach(pt => {
      try {
        const circle = L.circleMarker([pt.lat, pt.lng], {
          radius: 6,
          color: store?.markerColor || "blue",
          fillColor: store?.markerColor || "blue",
          fillOpacity: 0.9
        }).addTo(map);
        tempRouteMarkers.current.push(circle);
      } catch (err) {}
    });

    return () => {
      tempRouteMarkers.current.forEach(m => {
        try {
          if (m && map.hasLayer && map.hasLayer(m)) map.removeLayer(m);
        } catch (err) {}
      });
      tempRouteMarkers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store?.selectedPoints, store?.markerColor]);

  // Lógica para comprobar misión
  const handleCheckMission = () => {
    const map = mapRef.current;
    if (!map || !preparedMission || !store?.userLocation) {
      try {
        L.popup()
          .setLatLng(map ? map.getCenter() : [40.4168, -3.7038])
          .setContent("Necesitamos tu ubicación para comprobar la misión. Permite la ubicación y vuelve a intentarlo.")
          .openOn(map || null);
      } catch (err) {}
      return;
    }

    const userLatLng = L.latLng(store.userLocation.lat, store.userLocation.lng);
    let newlyCompleted = 0;

    missionMarkers.current.forEach((marker, idx) => {
      if (!marker || !marker.getLatLng) return;
      const dist = userLatLng.distanceTo(marker.getLatLng());
      if (dist <= PROXIMITY_METERS) {
        try {
          if (map.hasLayer && map.hasLayer(marker)) map.removeLayer(marker);
        } catch (err) {}
        missionMarkers.current[idx] = null;
        newlyCompleted++;
      } else {
        try {
          marker.bindPopup(`A ${Math.round(dist)} m. Acércate para completar.`).openPopup();
          setTimeout(() => {
            try {
              marker.closePopup();
            } catch (err) {}
          }, 1200);
        } catch (err) {}
      }
    });

    if (newlyCompleted > 0) {
      setCompletedCount(prev => prev + newlyCompleted);
    }

    missionMarkers.current = missionMarkers.current.filter(Boolean);

    if (missionMarkers.current.length === 0) {
      try {
        L.popup()
          .setLatLng(userLatLng)
          .setContent(`<strong>Misión completada</strong><br/>Has completado la misión.`)
          .openOn(map);
      } catch (err) {}

      try {
        sessionStorage.removeItem("selectedMission");
      } catch (err) {}

      if (actions?.onMissionComplete) {
        try {
          actions.onMissionComplete(preparedMission);
        } catch (err) {}
      }

      setTimeout(() => {
        setPreparedMission(null);
        setCompletedCount(0);
      }, 1200);
    }
  };

  // Modal submit handlers
  const openModalForSave = () => {
    setFormName((store.currentRouteMeta && store.currentRouteMeta.name) || "Ruta sin nombre");
    setFormDescription((store.currentRouteMeta && store.currentRouteMeta.description) || "");
    setFormCharacteristics((store.currentRouteMeta && store.currentRouteMeta.characteristics) || "");
    setPublishAfterSave(false);
    setIsModalOpen(true);
  };

  const openModalForPublish = () => {
    setFormName((store.currentRouteMeta && store.currentRouteMeta.name) || "Ruta sin nombre");
    setFormDescription((store.currentRouteMeta && store.currentRouteMeta.description) || "");
    setFormCharacteristics((store.currentRouteMeta && store.currentRouteMeta.characteristics) || "");
    setPublishAfterSave(true);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(false);

    // Guardar local primero
    if (actions?.saveRouteLocalFromSelected) {
      await actions.saveRouteLocalFromSelected({
        name: formName,
        description: formDescription,
        characteristics: formCharacteristics
      });
    }

    // Si el usuario pidió publicar, intentar publicar
    if (publishAfterSave && actions?.publishRouteFromSelected) {
      const res = await actions.publishRouteFromSelected({
        name: formName,
        description: formDescription,
        characteristics: formCharacteristics
      });
      if (res && res.success) {
        try { alert("Ruta publicada correctamente"); } catch (err) {}
      } else {
        try { alert("Ruta guardada localmente (no se pudo publicar)"); } catch (err) {}
      }
    } else {
      try { alert("Ruta guardada localmente"); } catch (err) {}
    }
  };

  const handleSaveLocal = () => openModalForSave();
  const handlePublish = () => openModalForPublish();

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {/* PANEL LATERAL IZQUIERDO */}
      <aside style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 9999,
        width: 260,
        background: "linear-gradient(180deg, rgba(18,18,30,0.96), rgba(12,12,22,0.96))",
        color: "#fff",
        padding: "14px",
        borderRadius: 10,
        boxShadow: "0 8px 28px rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
      }}>
        <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>SHADOWMAP</div>

        <button
          onClick={() => {
            if (actions?.startNewRoute) actions.startNewRoute();
          }}
          style={{
            padding: "10px 12px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Crear nueva ruta
        </button>

        <button
          onClick={handleSaveLocal}
          style={{
            padding: "10px 12px",
            background: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Guardar local
        </button>

        <button
          onClick={handlePublish}
          style={{
            padding: "10px 12px",
            background: "#ff9800",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Publicar
        </button>

        <button
          onClick={() => {
            if (actions?.clearSelectedPoints) actions.clearSelectedPoints();
          }}
          style={{
            padding: "10px 12px",
            background: "#e53935",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Cancelar
        </button>

        <div style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}>
          <div>Haz clic en el mapa para añadir puntos.</div>
          <div style={{ marginTop: 8 }}>
            {store?.userLocation ? (
              <span style={{ color: "#b2ffb4" }}>Ubicación disponible</span>
            ) : (
              <span style={{ color: "#ffb4b4" }}>Permite la ubicación para misiones</span>
            )}
          </div>
        </div>
      </aside>

      {/* MAPA */}
      <div
        id="map"
        ref={containerRef}
        className="map-view"
        style={{ height: "100%", width: "100%" }}
      />

      {/* MODAL FORMULARIO */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 10050,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.45)"
        }}>
          <form onSubmit={handleModalSubmit} style={{
            width: 420,
            background: "#0f1724",
            color: "#fff",
            padding: 18,
            borderRadius: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Guardar ruta</h3>

            <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
              Nombre
              <input
                value={formName}
                onChange={e => setFormName(e.target.value)}
                required
                style={{ width: "100%", marginTop: 6, padding: "8px 10px", borderRadius: 6, border: "1px solid #2b2f3a", background: "#0b1220", color: "#fff" }}
              />
            </label>

            <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
              Descripción
              <textarea
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                rows={3}
                style={{ width: "100%", marginTop: 6, padding: "8px 10px", borderRadius: 6, border: "1px solid #2b2f3a", background: "#0b1220", color: "#fff" }}
              />
            </label>

            <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
              Características
              <input
                value={formCharacteristics}
                onChange={e => setFormCharacteristics(e.target.value)}
                style={{ width: "100%", marginTop: 6, padding: "8px 10px", borderRadius: 6, border: "1px solid #2b2f3a", background: "#0b1220", color: "#fff" }}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <input type="checkbox" checked={publishAfterSave} onChange={e => setPublishAfterSave(e.target.checked)} />
              <span style={{ fontSize: 13 }}>Publicar después de guardar</span>
            </label>

            <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "8px 12px", borderRadius: 8, background: "#2b2f3a", color: "#fff", border: "none" }}>
                Cancelar
              </button>
              <button type="submit" style={{ padding: "8px 12px", borderRadius: 8, background: "#1976d2", color: "#fff", border: "none" }}>
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TOAST PERMISO DENEGADO */}
      {showLocationDeniedToast && (
        <div style={{
          position: "fixed",
          bottom: 18,
          left: 18,
          zIndex: 10060,
          background: "#2b2a2a",
          color: "#fff",
          padding: "12px 14px",
          borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
          maxWidth: 360
        }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Permiso de ubicación denegado</div>
          <div style={{ fontSize: 13, opacity: 0.95 }}>
            Has denegado el acceso a la ubicación. Para usar misiones y centrar el mapa, habilita la ubicación en la configuración del sitio (candado en la barra de direcciones) y recarga la página.
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setShowLocationDeniedToast(false)} style={{ background: "transparent", border: "1px solid #444", color: "#fff", padding: "6px 8px", borderRadius: 6 }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;

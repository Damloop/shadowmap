// src/front/js/component/MapView.jsx

import React, { useEffect, useContext, useRef, useMemo, useState } from "react";
import { Context } from "../store/appContext.jsx";
import { API_URL } from "../../api/config.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import greenMarker from "../../img/markers/green-marker.png";
import redMarker from "../../img/markers/red-marker.png";

const PROXIMITY_METERS = 60;

const MapView = ({ activeMission: propMission, isCreatingRoute, setIsCreatingRoute }) => {
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

  // Solicitar ubicación
  useEffect(() => {
    const requestLocation = async () => {
      if (!navigator.geolocation) return;

      try {
        if (navigator.permissions && navigator.permissions.query) {
          const status = await navigator.permissions.query({ name: "geolocation" });

          if (status.state === "denied") {
            setShowLocationDeniedToast(true);
            return;
          }

          navigator.geolocation.getCurrentPosition(
            pos => {
              if (actions?.getUserLocation) actions.getUserLocation();
            },
            err => {
              if (err.code === 1) setShowLocationDeniedToast(true);
            }
          );

          status.onchange = () => {
            if (status.state === "denied") setShowLocationDeniedToast(true);
            else setShowLocationDeniedToast(false);
          };
        } else {
          navigator.geolocation.getCurrentPosition(
            pos => {
              if (actions?.getUserLocation) actions.getUserLocation();
            },
            err => {
              if (err.code === 1) setShowLocationDeniedToast(true);
            }
          );
        }
      } catch (err) {}
    };

    requestLocation();
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

    // SOLO añadir puntos si estamos creando una ruta
    map.on("click", (e) => {
      if (!isCreatingRoute) return;
      if (actions?.addPointToRoute) {
        actions.addPointToRoute(e.latlng.lat, e.latlng.lng);
      }
    });

    mapRef.current = map;

    setTimeout(() => map.invalidateSize(), 120);

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
  }, [actions, isCreatingRoute]);

  // Generador de misión
  const generateMissionNear = (template, baseLat, baseLng) => {
    if (!template) return null;

    if (template.type === "reach_point" && template.target) {
      if (typeof template.target.lat === "number") {
        return {
          ...template,
          preparedCheckpoints: [{ lat: template.target.lat, lng: template.target.lng }]
        };
      }
      return {
        ...template,
        preparedCheckpoints: [{
          lat: baseLat + (template.target.latOffset || 0),
          lng: baseLng + (template.target.lngOffset || 0)
        }]
      };
    }

    if (template.type === "multi_checkpoint") {
      const prepared = template.checkpoints.map(cp => ({
        lat: cp.lat ?? baseLat + (Math.random() - 0.5) * 0.002,
        lng: cp.lng ?? baseLng + (Math.random() - 0.5) * 0.002
      }));
      return { ...template, preparedCheckpoints: prepared };
    }

    const count = template?.checkpoints?.length || 3;
    const prepared = Array.from({ length: count }).map(() => ({
      lat: baseLat + (Math.random() - 0.5) * 0.002,
      lng: baseLng + (Math.random() - 0.5) * 0.002
    }));

    return { ...template, preparedCheckpoints: prepared };
  };

  // Preparar misión
  useEffect(() => {
    const loc = store?.userLocation;
    if (!loc) return;

    let mission = propMission;
    if (!mission) {
      try {
        const stored = sessionStorage.getItem("selectedMission");
        if (stored) mission = JSON.parse(stored);
      } catch (err) {}
    }

    if (!mission) {
      setPreparedMission(null);
      return;
    }

    const prepared = generateMissionNear(mission, loc.lat, loc.lng);
    setPreparedMission(prepared);
    setCompletedCount(0);
  }, [propMission, store?.userLocation]);

  // Renderizar marcadores de misión
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !preparedMission) return;

    missionMarkers.current.forEach(m => {
      try {
        if (map.hasLayer(m)) map.removeLayer(m);
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

    const focus = checkpoints[0] || store?.userLocation;
    if (focus) {
      try {
        map.setView([focus.lat, focus.lng], 15);
      } catch (err) {}
    }

    setTimeout(() => map.invalidateSize(), 120);
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
            if (map.hasLayer(m)) map.removeLayer(m);
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
          if (map.hasLayer(m)) map.removeLayer(m);
        } catch (err) {}
      });
      poiMarkers.current = [];
    };
  }, [greenIcon]);

  // Actualizar marcador de usuario
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !store?.userLocation) return;

    const { lat, lng } = store.userLocation;

    if (userMarker.current) {
      try {
        if (map.hasLayer(userMarker.current)) map.removeLayer(userMarker.current);
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

    setTimeout(() => map.invalidateSize(), 80);
  }, [store?.userLocation]);

  // Renderizar puntos de ruta temporal
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    tempRouteMarkers.current.forEach(m => {
      try {
        if (map.hasLayer(m)) map.removeLayer(m);
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
          if (map.hasLayer(m)) map.removeLayer(m);
        } catch (err) {}
      });
      tempRouteMarkers.current = [];
    };
  }, [store?.selectedPoints, store?.markerColor]);

  // Modal submit handlers
  const openModalForSave = () => {
    setFormName(store.currentRouteMeta?.name || "Ruta sin nombre");
    setFormDescription(store.currentRouteMeta?.description || "");
    setFormCharacteristics(store.currentRouteMeta?.characteristics || "");
    setPublishAfterSave(false);
    setIsModalOpen(true);
  };

  const openModalForPublish = () => {
    setFormName(store.currentRouteMeta?.name || "Ruta sin nombre");
    setFormDescription(store.currentRouteMeta?.description || "");
    setFormCharacteristics(store.currentRouteMeta?.characteristics || "");
    setPublishAfterSave(true);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(false);

    if (actions?.saveRouteLocalFromSelected) {
      await actions.saveRouteLocalFromSelected({
        name: formName,
        description: formDescription,
        characteristics: formCharacteristics
      });
    }

    if (publishAfterSave && actions?.publishRouteFromSelected) {
      const res = await actions.publishRouteFromSelected({
        name: formName,
        description: formDescription,
        characteristics: formCharacteristics
      });
      if (res?.success) alert("Ruta publicada correctamente");
      else alert("Ruta guardada localmente (no se pudo publicar)");
    } else {
      alert("Ruta guardada localmente");
    }
  };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>

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

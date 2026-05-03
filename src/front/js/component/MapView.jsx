// src/front/js/component/MapView.jsx

import React, { useEffect, useContext, useRef } from "react";
import { Context } from "../store/appContext.jsx";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ isCreatingRoute }) => {
  const { store } = useContext(Context);

  const mapRef = useRef(null);
  const containerRef = useRef(null);

  const userMarker = useRef(null);
  const tempMarkers = useRef([]);
  const missionMarker = useRef(null);

  /* ---------------------------
     ICONO ESPECIAL MISIÓN
  ---------------------------*/
  const missionIcon = L.divIcon({
    className: "mission-icon",
    html: `<div class="mission-pulse"></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  /* ---------------------------
     INICIALIZAR MAPA
  ---------------------------*/
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map(containerRef.current).setView([40.4168, -3.7038], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(map);

    mapRef.current = map;

    setTimeout(() => map.invalidateSize(), 200);
  }, []);

  /* ---------------------------
     MOSTRAR PUNTO DE MISIÓN
  ---------------------------*/
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (missionMarker.current) {
      try { map.removeLayer(missionMarker.current); } catch {}
    }

    if (store.missionPoint) {
      missionMarker.current = L.marker(
        [store.missionPoint.lat, store.missionPoint.lng],
        { icon: missionIcon }
      ).addTo(map);

      map.setView([store.missionPoint.lat, store.missionPoint.lng], 16);
    }
  }, [store.missionPoint]);

  /* ---------------------------
     MARCADOR DE USUARIO
  ---------------------------*/
  useEffect(() => {
    if (!isCreatingRoute) return;
    if (!store.userLocation) return;

    const map = mapRef.current;
    const { lat, lng } = store.userLocation;

    if (userMarker.current) {
      try { map.removeLayer(userMarker.current); } catch {}
    }

    const bouncingIcon = L.divIcon({
      className: "bouncing-marker",
      html: `<div class="bounce-dot"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    userMarker.current = L.marker([lat, lng], { icon: bouncingIcon }).addTo(map);

    map.setView([lat, lng], 16);
  }, [isCreatingRoute, store.userLocation]);

  /* ---------------------------
     DIBUJAR PUNTOS TEMPORALES
  ---------------------------*/
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    tempMarkers.current.forEach(m => {
      try { map.removeLayer(m); } catch {}
    });
    tempMarkers.current = [];

    (store.selectedPoints || []).forEach(pt => {
      const marker = L.circleMarker([pt.lat, pt.lng], {
        radius: 7,
        color: "#000000",
        fillColor: "#eb1212",
        fillOpacity: 1
      }).addTo(map);

      tempMarkers.current.push(marker);
    });
  }, [store.selectedPoints]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default MapView;
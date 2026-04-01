import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ICONOS PERSONALIZADOS
const iconRosa = L.icon({
  iconUrl: "/img/markers/pink-marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

const iconAzul = L.icon({
  iconUrl: "/img/markers/blue-marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

const iconAmarillo = L.icon({
  iconUrl: "/img/markers/yellow-marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

const iconMorado = L.icon({
  iconUrl: "/img/markers/purple-marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

const iconBlanco = L.icon({
  iconUrl: "/img/markers/white-marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

// FUNCIÓN PARA ASIGNAR ICONO SEGÚN TIPO
const getIconByType = (type) => {
  switch (type) {
    case "social": return iconRosa;
    case "tech": return iconAzul;
    case "exploration": return iconAmarillo;
    case "main": return iconMorado;
    case "neutral": return iconBlanco;
    default: return iconMorado;
  }
};

export const MapView = () => {

  useEffect(() => {
    // Inicializar mapa
    const map = L.map("map", {
      zoomControl: false
    }).setView([40.4168, -3.7038], 13);

    // Capa base
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(map);

    // EJEMPLO DE POIs
    const pois = [
      { name: "Zona Social", lat: 40.4178, lng: -3.7030, type: "social" },
      { name: "Terminal Tech", lat: 40.4185, lng: -3.7045, type: "tech" },
      { name: "Punto de Exploración", lat: 40.4192, lng: -3.7055, type: "exploration" },
      { name: "Base Principal", lat: 40.4200, lng: -3.7060, type: "main" },
      { name: "Zona Neutral", lat: 40.4210, lng: -3.7070, type: "neutral" }
    ];

    // Renderizar POIs
    pois.forEach(poi => {
      L.marker([poi.lat, poi.lng], {
        icon: getIconByType(poi.type)
      })
      .addTo(map)
      .bindPopup(`<b>${poi.name}</b>`);
    });

  }, []);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "100vh"
      }}
    ></div>
  );
};

export default MapView;

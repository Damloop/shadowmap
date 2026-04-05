import React, { useEffect, useContext, useRef } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import blueMarker from "../../img/markers/blue-marker.png";
import greenMarker from "../../img/markers/green-marker.png";
import pinkMarker from "../../img/markers/pink-marker.png";
import redMarker from "../../img/markers/red-marker.png";
import yellowMarker from "../../img/markers/yellow-marker.png";

const icons = {
  blue: L.icon({ iconUrl: blueMarker, iconSize: [38, 38], iconAnchor: [19, 38] }),
  green: L.icon({ iconUrl: greenMarker, iconSize: [38, 38], iconAnchor: [19, 38] }),
  pink: L.icon({ iconUrl: pinkMarker, iconSize: [38, 38], iconAnchor: [19, 38] }),
  red: L.icon({ iconUrl: redMarker, iconSize: [38, 38], iconAnchor: [19, 38] }),
  yellow: L.icon({ iconUrl: yellowMarker, iconSize: [38, 38], iconAnchor: [19, 38] })
};

const routeColors = {
  blue: "#3b82f6",
  green: "#22c55e",
  pink: "#ec4899",
  red: "#ef4444",
  yellow: "#eab308"
};

export const MapView = () => {
  const { store, actions } = useContext(Context);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const routeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map", { zoomControl: false }).setView([40.4168, -3.7038], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(map);

    map.on("click", e => {
      actions.addPointToRoute(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (routeRef.current) {
      map.removeLayer(routeRef.current);
    }

    if (store.selectedPoints.length > 1) {
      routeRef.current = L.polyline(
        store.selectedPoints.map(p => [p.lat, p.lng]),
        { color: routeColors[store.markerColor], weight: 4 }
      ).addTo(map);
    }
  }, [store.selectedPoints, store.markerColor]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (store.selectedPoints.length > 0) {
      const last = store.selectedPoints[store.selectedPoints.length - 1];
      const icon = icons[store.markerColor];
      const marker = L.marker([last.lat, last.lng], { icon }).addTo(map);
      markersRef.current.push(marker);
    }
  }, [store.selectedPoints, store.markerColor]);

  return <div id="map" className="map-view"></div>;
};

export default MapView;

import React, { useEffect, useContext, useRef } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ICONOS PERSONALIZADOS (adaptados a tu estructura real)
const icons = {
    social: L.icon({ iconUrl: "/img/markers/pink-marker.png", iconSize: [38, 38], iconAnchor: [19, 38] }),
    tech: L.icon({ iconUrl: "/img/markers/blue-marker.png", iconSize: [38, 38], iconAnchor: [19, 38] }),
    exploration: L.icon({ iconUrl: "/img/markers/yellow-marker.png", iconSize: [38, 38], iconAnchor: [19, 38] }),
    main: L.icon({ iconUrl: "/img/markers/purple-marker.png", iconSize: [38, 38], iconAnchor: [19, 38] }),
    neutral: L.icon({ iconUrl: "/img/markers/white-marker.png", iconSize: [38, 38], iconAnchor: [19, 38] })
};

const getIconByType = type => icons[type] || icons.main;

export const MapView = () => {
    const { store, actions } = useContext(Context);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const navigate = useNavigate();

    // Cargar POIs desde el backend
    useEffect(() => {
        actions.loadPois(); // ← aquí conectamos al backend real
    }, []);

    // Inicializar mapa solo una vez
    useEffect(() => {
        if (mapRef.current) return;

        const map = L.map("map", { zoomControl: false }).setView([40.4168, -3.7038], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19
        }).addTo(map);

        mapRef.current = map;

        return () => map.remove();
    }, []);

    // Renderizar POIs dinámicos
    useEffect(() => {
        if (!mapRef.current || !store.pois?.length) return;

        const map = mapRef.current;

        // LIMPIAR MARKERS ANTERIORES
        markersRef.current.forEach(m => map.removeLayer(m));
        markersRef.current = [];

        // AÑADIR NUEVOS MARKERS
        store.pois.forEach(poi => {
            const marker = L.marker([poi.lat, poi.lng], {
                icon: getIconByType(poi.type)
            }).addTo(map);

            marker.bindPopup(`
                <div style="text-align:center;">
                    <b>${poi.name}</b><br>
                    <button class="popup-btn" data-id="${poi.id}" style="
                        margin-top:6px;
                        padding:4px 10px;
                        border:none;
                        background:#6c2bd9;
                        color:white;
                        border-radius:4px;
                        cursor:pointer;
                    ">Ver detalles</button>
                </div>
            `);

            marker.on("popupopen", () => {
                const btn = document.querySelector(`.popup-btn[data-id="${poi.id}"]`);
                if (btn) btn.onclick = () => navigate(`/place/${poi.id}`);
            });

            markersRef.current.push(marker);
        });

    }, [store.pois]);

    return <div id="map" className="map-view"></div>;
};

export default MapView;

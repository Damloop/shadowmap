import React, { useEffect, useContext, useRef } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ICONOS
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
    const navigate = useNavigate();

    useEffect(() => {
        actions.loadPois();
    }, []);

    useEffect(() => {
        if (mapRef.current) return;

        const map = L.map("map", { zoomControl: false }).setView([40.4168, -3.7038], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19
        }).addTo(map);

        mapRef.current = map;

        return () => map.remove();
    }, []);

    useEffect(() => {
        if (!mapRef.current || !store.pois?.length) return;

        const map = mapRef.current;

        // BORRAR SOLO MARKERS
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) map.removeLayer(layer);
        });

        // AÑADIR MARKERS
        store.pois.forEach(poi => {
            const marker = L.marker([poi.lat, poi.lng], {
                icon: getIconByType(poi.type)
            }).addTo(map);

            marker.bindPopup(`
                <b>${poi.name}</b><br>
                <button id="btn-${poi.id}" style="margin-top:5px;">Ver detalles</button>
            `);

            marker.on("popupopen", () => {
                const btn = document.getElementById(`btn-${poi.id}`);
                if (btn) btn.addEventListener("click", () => navigate(`/place/${poi.id}`));
            });
        });

    }, [store.pois]);

    return <div id="map" className="map-view"></div>;
};

export default MapView;

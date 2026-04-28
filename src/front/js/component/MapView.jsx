// src/front/js/component/MapView.jsx

import React, { useEffect, useContext, useRef } from "react";
import { Context } from "../store/appContext";
import { API_URL } from "../../api/config";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ activeMission }) => {
    const { store, actions } = useContext(Context);
    const mapRef = useRef(null);
    const poiMarkers = useRef([]);
    const missionMarkers = useRef([]);

    // ICONOS SHADOWMAP (ruta correcta para Vite)
    const greenIcon = L.icon({
        iconUrl: "/img/markers/green-marker.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    });

    const redIcon = L.icon({
        iconUrl: "/img/markers/red-marker.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    });

    // 1. Inicializar mapa SOLO una vez
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

    // 2. Centrar mapa en la ubicación del usuario
    useEffect(() => {
        if (!mapRef.current || !store.userLocation) return;

        const { lat, lng } = store.userLocation;
        mapRef.current.setView([lat, lng], 15);

        L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                iconSize: [32, 32]
            })
        }).addTo(mapRef.current);

    }, [store.userLocation]);

    // 3. Cargar POIs (marcadores verdes)
    useEffect(() => {
        if (!mapRef.current) return;

        const loadPOIs = async () => {
            try {
                const response = await fetch(`${API_URL}/api/pois`);
                if (!response.ok) return;

                const data = await response.json();

                poiMarkers.current.forEach(m => mapRef.current.removeLayer(m));
                poiMarkers.current = [];

                data.forEach(poi => {
                    const marker = L.marker([poi.lat, poi.lng], {
                        icon: greenIcon
                    }).addTo(mapRef.current);

                    poiMarkers.current.push(marker);
                });

            } catch (error) {}
        };

        loadPOIs();
    }, []);

    // 4. Dibujar misión activa (marcadores rojos)
    useEffect(() => {
        if (!activeMission || !mapRef.current || !store.userLocation) return;

        const map = mapRef.current;
        const { lat, lng } = store.userLocation;

        missionMarkers.current.forEach(m => map.removeLayer(m));
        missionMarkers.current = [];

        if (activeMission.type === "reach_point") {
            const tLat = lat + activeMission.target.latOffset;
            const tLng = lng + activeMission.target.lngOffset;

            const marker = L.marker([tLat, tLng], { icon: redIcon }).addTo(map);

            missionMarkers.current.push(marker);
            map.setView([tLat, tLng], 16);
        }

        if (activeMission.type === "multi_checkpoint") {
            activeMission.checkpoints.forEach(cp => {
                const cLat = lat + cp.latOffset;
                const cLng = lng + cp.lngOffset;

                const marker = L.marker([cLat, cLng], { icon: redIcon }).addTo(map);

                missionMarkers.current.push(marker);
            });

            const first = activeMission.checkpoints[0];
            map.setView([lat + first.latOffset, lng + first.lngOffset], 16);
        }

    }, [activeMission, store.userLocation]);

    return <div id="map" className="map-view"></div>;
};

export default MapView;

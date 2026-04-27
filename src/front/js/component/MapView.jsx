import React, { useEffect, useContext, useRef } from "react";
import { Context } from "../store/appContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const MapView = ({ activeMission }) => {
    const { store, actions } = useContext(Context);
    const mapRef = useRef(null);
    const missionMarkers = useRef([]);

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
        if (!activeMission || !mapRef.current || !store.userLocation) return;

        const map = mapRef.current;
        const { lat, lng } = store.userLocation;

        missionMarkers.current.forEach(m => map.removeLayer(m));
        missionMarkers.current = [];

        if (activeMission.type === "reach_point") {
            const tLat = lat + activeMission.target.latOffset;
            const tLng = lng + activeMission.target.lngOffset;

            const marker = L.marker([tLat, tLng]).addTo(map);
            missionMarkers.current.push(marker);

            map.setView([tLat, tLng], 16);
        }

        if (activeMission.type === "multi_checkpoint") {
            activeMission.checkpoints.forEach(cp => {
                const cLat = lat + cp.latOffset;
                const cLng = lng + cp.lngOffset;

                const marker = L.marker([cLat, cLng]).addTo(map);
                missionMarkers.current.push(marker);
            });

            const first = activeMission.checkpoints[0];
            const fLat = lat + first.latOffset;
            const fLng = lng + first.lngOffset;

            map.setView([fLat, fLng], 16);
        }

    }, [activeMission, store.userLocation]);

    return <div id="map" className="map-view"></div>;
};

export default MapView;

// src/front/js/views/map.jsx

import React, { useEffect, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

import MapView from "../component/MapView.jsx";
import { missions } from "../../data/missions.js";

import "../../styles/map.css";

const Map = () => {
    const { store, actions } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();

    const [activeMission, setActiveMission] = useState(null);

    useEffect(() => {
        actions.loadPois();
        actions.loadSharedRoutes();
        actions.getUserLocation();
    }, []);

    useEffect(() => {
        const missionId = location.state?.missionId;

        if (missionId) {
            const m = missions.find(x => x.id === missionId);
            setActiveMission(m);
            sessionStorage.setItem("selectedMission", JSON.stringify(m));
            return;
        }

        const stored = sessionStorage.getItem("selectedMission");
        if (stored) setActiveMission(JSON.parse(stored));
    }, [location.state]);

    return (
        <div className="map-page-container">

            <div className="map-left-panel">

                <h2 className="panel-title">SHADOWMAP - Mapa de Exploración Paranormal</h2>

                <div className="panel-buttons">
                    <button className="shadow-btn shadow-btn-main">Crear nueva ruta</button>
                    <button className="shadow-btn shadow-btn-secondary">Mis rutas guardadas</button>
                    <button className="shadow-btn shadow-btn-secondary">Compartidas conmigo</button>
                </div>

                {activeMission ? (
                    <div className="mission-box">
                        <h3>Misión activa</h3>
                        <p className="mission-name">{activeMission.name}</p>
                        <p className="mission-desc">{activeMission.description}</p>
                        <p className="mission-diff">Dificultad: {activeMission.difficulty}</p>
                        <div className="mission-aura"></div>
                    </div>
                ) : (
                    <div className="mission-box empty">
                        <p>No hay misión activa</p>
                    </div>
                )}

                <button
                    className="shadow-btn shadow-btn-secondary"
                    onClick={() => navigate("/profile")}
                >
                    Volver
                </button>

            </div>

            <div className="map-right-panel">
                <MapView activeMission={activeMission} />
            </div>

        </div>
    );
};

export default Map;

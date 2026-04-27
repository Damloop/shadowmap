// src/front/js/views/map.jsx

import React, { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "../store/appContext";

import MapView from "../component/MapView.jsx";
import SavedRoutes from "../component/SavedRoutes.jsx";
import SharedRoutes from "../component/SharedRoutes.jsx";

import { missions } from "../../data/missions.js";

import "../../styles/map.css";

const Map = () => {
    const { store, actions } = useContext(Context);
    const location = useLocation();

    const [activeMission, setActiveMission] = useState(null);

    // ============================================================
    // 1. Cargar POIs + rutas + pedir ubicación al entrar
    // ============================================================
    useEffect(() => {
        actions.loadPois();
        actions.loadSharedRoutes();
        actions.getUserLocation();
    }, []);

    // ============================================================
    // 2. Cargar misión activa desde navegación o sessionStorage
    // ============================================================
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

            {/* ============================================================
                PANEL IZQUIERDO — ESTÉTICA SHADOWMAP
            ============================================================ */}
            <div className="map-left-panel">

                <h2 className="panel-title">Exploración Paranormal</h2>

                <div className="panel-buttons">
                    <button className="shadow-btn">➕ Crear nueva ruta</button>
                    <button className="shadow-btn">📁 Mis rutas guardadas</button>
                    <button className="shadow-btn">🧿 Compartidas conmigo</button>
                </div>

                {/* ============================================================
                    MISIÓN ACTIVA — MISTERIOSA Y ESPECTRAL
                ============================================================ */}
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

                {/* ============================================================
                    RUTAS GUARDADAS Y COMPARTIDAS
                ============================================================ */}
                <SavedRoutes />
                <SharedRoutes />
            </div>

            {/* ============================================================
                MAPA — OCUPA TODO EL RESTO
            ============================================================ */}
            <div className="map-right-panel">
                <MapView activeMission={activeMission} />
            </div>
        </div>
    );
};

export default Map;

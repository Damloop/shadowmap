import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "../store/appContext";

import MapView from "../component/MapView.jsx";
import RouteCreator from "../component/RouteCreator.jsx";
import RouteColorSelector from "../component/RouteColorSelector.jsx";
import SavedRoutes from "../component/SavedRoutes.jsx";
import SharedRoutes from "../component/SharedRoutes.jsx";

import { missions } from "../../data/missions.js";

import "../../styles/map.css";
import "../../styles/routeCreator.css";

const Map = () => {
    const { actions } = useContext(Context);
    const location = useLocation();

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
        <div className="map-page">

            <div className="left-panel">
                <h2 className="left-title">ROUTES</h2>

                <div className="left-section">
                    <h3 className="left-subtitle">Create new</h3>
                    <p className="left-text">Select 5 points on the map to begin.</p>
                </div>

                <SavedRoutes />
                <SharedRoutes />

                {activeMission && (
                    <div className="mission-box">
                        <h3 className="mission-title">{activeMission.name}</h3>
                        <p className="mission-desc">{activeMission.description}</p>
                        <p className="mission-diff">Dificultad: {activeMission.difficulty}</p>
                    </div>
                )}
            </div>

            <div className="map-container">
                <MapView activeMission={activeMission} />
                <RouteCreator />
                <RouteColorSelector />
            </div>
        </div>
    );
};

export default Map;

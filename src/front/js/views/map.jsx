import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

import MapView from "../component/MapView.jsx";
import RouteCreator from "../component/RouteCreator.jsx";
import RouteColorSelector from "../component/RouteColorSelector.jsx";
import SavedRoutes from "../component/SavedRoutes.jsx";
import SharedRoutes from "../component/SharedRoutes.jsx";

import "../../styles/map.css";
import "../../styles/routeCreator.css";

const Map = () => {
    const { actions } = useContext(Context);

    useEffect(() => {
        actions.loadPois();
        actions.loadSharedRoutes();
    }, []);

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
            </div>

            <div className="map-container">
                <MapView />
                <RouteCreator />
                <RouteColorSelector />
            </div>
        </div>
    );
};

export default Map;

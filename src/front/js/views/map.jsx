import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import MapView from "../component/MapView.jsx";
import Sidebar from "../component/Sidebar.jsx";

const Map = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        actions.loadPois();
    }, []);

    return (
        <div className="shadowmap-container">

            {/* PANEL LATERAL */}
            <Sidebar />

            {/* MAPA */}
            <div className="map-view">
                <MapView />
            </div>

            {/* BOTÓN FLOTANTE */}
            <button
                className="add-button"
                onClick={() => navigate("/add-place")}
            >
                +
            </button>
        </div>
    );
};

export default Map;

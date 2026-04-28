// src/front/js/views/profile.jsx

import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";
import { getAvatarLore } from "../../data/avatarLore";
import { avatarData } from "../../data/avatarData";
import { missions } from "../../data/missions";
import { MissionCarousel } from "../component/MissionCarousel.jsx";
import "../../styles/profile.css";

const Profile = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [level, setLevel] = useState(0);
    const [completedMissions, setCompletedMissions] = useState([]);
    const [selectedMission, setSelectedMission] = useState(null);

    const premiumLevel = sessionStorage.getItem("premiumLevel");
    const premiumNick = sessionStorage.getItem("premiumNick");

    useEffect(() => {
        actions.syncTokenFromSessionStore();
    }, []);

    useEffect(() => {
        if (!store.user) {
            const saved = localStorage.getItem("user");
            if (saved) actions.syncTokenFromSessionStore();
        }
    }, [store.user]);

    if (!store.user) {
        return <div className="profile-loading">Cargando identidad...</div>;
    }

    const user = store.user;

    const avatarInfo = avatarData.find(a => a.id === Number(user.avatar));
    const lore = getAvatarLore(Number(user.avatar));

    const {
        shortname,
        routesVisited,
        routesCreated,
        routesShared,
        explorerScore,
        creatorScore,
        is_premium
    } = user;

    const handleSelectMission = (mission) => {
        if (mission.locked) return;
        sessionStorage.setItem("selectedMission", JSON.stringify(mission));
        setSelectedMission(mission);
        navigate("/map");
    };

    const handleCompleteMission = (mission) => {
        if (!completedMissions.includes(mission.id)) {
            setCompletedMissions([...completedMissions, mission.id]);
            setLevel(level + 5);
        }
        setSelectedMission(null);
    };

    return (
        <div className="profile-container">

            <aside className="sidebar">
                <div className="sidebar-logo-mini">SHADOWMAP</div>

                <h2>Actividad</h2>
                <ul>
                    <li data-tooltip="Número total de rutas que has visitado">
                        <span>Rutas visitadas</span><span>{routesVisited || 0}</span>
                    </li>

                    <li data-tooltip="Rutas que tú mismo has creado">
                        <span>Rutas creadas</span><span>{routesCreated || 0}</span>
                    </li>

                    <li data-tooltip="Rutas que otros usuarios han compartido contigo">
                        <span>Compartidas conmigo</span><span>{routesShared || 0}</span>
                    </li>
                </ul>

                <h2>Puntuación</h2>
                <ul>
                    <li data-tooltip="Tu nivel como explorador basado en misiones completadas">
                        <span>Explorador</span><span>{explorerScore || 0}</span>
                    </li>

                    <li data-tooltip="Tu nivel como creador de rutas y contenido">
                        <span>Creador</span><span>{creatorScore || 0}</span>
                    </li>
                </ul>

                <h2>Estado</h2>
                <ul>
                    <li data-tooltip="Tipo de cuenta que posees actualmente">
                        {is_premium ? "Cuenta Premium" : "Cuenta Estándar"}
                    </li>
                </ul>

                {!is_premium && (
                    <div className="account-option" onClick={() => navigate("/premium")}>
                        Acceso a Premium
                    </div>
                )}

                <button
                    className="logout-btn"
                    onClick={() => {
                        actions.logout();
                        navigate("/login");
                    }}
                >
                    Log Out
                </button>
            </aside>

            <main className="profile-main">

                <div className="profile-card">

                    <div className="profile-avatar-wrapper">
                        <img
                            src={avatarInfo.src}
                            alt="avatar"
                            className="profile-avatar"
                        />
                    </div>

                    <div className="profile-info">
                        <h2>{shortname}</h2>

                        {premiumLevel && (
                            <p className="premium-level-display">
                                Nivel {premiumLevel} — {premiumNick}
                            </p>
                        )}

                        <p className="lore-text">
                            <strong>{lore.title}:</strong> {lore.origin}
                        </p>
                    </div>
                </div>

                <div className="mission-section">
                    <MissionCarousel
                        missions={[
                            ...missions.filter(m => !m.locked),
                            ...missions.filter(m => m.locked).slice(0, 1)
                        ]}
                        onSelect={(m) => handleSelectMission(m)}
                    />
                </div>

                {selectedMission && (
                    <div className="mission-modal">
                        <div className="mission-modal-content">
                            <h3>{selectedMission.name}</h3>
                            <p>{selectedMission.description}</p>

                            <button
                                className="btn-complete"
                                onClick={() => handleCompleteMission(selectedMission)}
                            >
                                Completar misión
                            </button>

                            <button
                                className="btn-close"
                                onClick={() => setSelectedMission(null)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}

            </main>

        </div>
    );
};

export default Profile;

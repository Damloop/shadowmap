// /src/front/js/views/profile.jsx

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

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(() => {}, () => {});
    }, []);

    useEffect(() => {
        if (!store.user) actions.getCurrentUser();
    }, []);

    if (!store.user) return <div className="profile-loading">Cargando identidad...</div>;

    const user = store.user;

    const avatarInfo = avatarData.find(a => a.id === Number(user.avatar));
    const lore = getAvatarLore(Number(user.avatar));

    const {
        username,
        routesVisited,
        routesCreated,
        routesShared,
        explorerScore,
        creatorScore,
        isPremium
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

            {/* ===== SIDEBAR ===== */}
            <aside className="sidebar">
                <div className="sidebar-logo-mini">SHADOWMAP</div>

                <h2>Actividad</h2>
                <ul>
                    <li className="tooltip">
                        <span>Rutas visitadas</span>
                        <span>{routesVisited || 0}</span>
                        <div className="tooltip-text">Lugares explorados.</div>
                    </li>

                    <li className="tooltip">
                        <span>Rutas creadas</span>
                        <span>{routesCreated || 0}</span>
                        <div className="tooltip-text">Rutas diseñadas por ti.</div>
                    </li>

                    <li className="tooltip">
                        <span>Compartidas conmigo</span>
                        <span>{routesShared || 0}</span>
                        <div className="tooltip-text">Rutas enviadas por otros.</div>
                    </li>
                </ul>

                <h2>Puntuación</h2>
                <ul>
                    <li className="tooltip">
                        <span>Explorador</span>
                        <span>{explorerScore || 0}</span>
                    </li>

                    <li className="tooltip">
                        <span>Creador</span>
                        <span>{creatorScore || 0}</span>
                    </li>
                </ul>

                <h2>Estado</h2>
                <ul>
                    <li>
                        <span>{isPremium ? "Cuenta Premium" : "Cuenta Estándar"}</span>
                    </li>
                </ul>

                {!isPremium && (
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

            {/* ===== MAIN ===== */}
            <main className="profile-main">

                <div className="profile-card">

                    {/* AVATAR SUBIDO Y MÁS GRANDE */}
                    <div className="profile-avatar-wrapper">
                        <img src={avatarInfo.src} className="profile-avatar" />
                    </div>

                    <div className="profile-info">
                        <h2>{username}</h2>
                        <p className="title">Nivel {level}</p>

                        <p className="lore-text">
                            <strong>{lore.title}:</strong> {lore.origin}
                        </p>
                    </div>
                </div>

                {/* MISIONES MÁS ABAJO */}
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

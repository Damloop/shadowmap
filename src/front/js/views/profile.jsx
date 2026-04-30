// src/front/js/views/profile.jsx

import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";
import { getAvatarLore } from "../../data/avatarLore";
import { avatarData } from "../../data/avatarData";
import { missions } from "../../data/missions";
import { MissionCarousel } from "../component/MissionCarousel.jsx";
import "../../styles/profile.css";
import "../../styles/map.css";

const COMPLETED_KEY = "shadowmap_completed_missions";

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

    useEffect(() => {
        try {
            const raw = localStorage.getItem(COMPLETED_KEY);
            setCompletedMissions(raw ? JSON.parse(raw) : []);
        } catch {
            setCompletedMissions([]);
        }

        const onStorage = (e) => {
            if (e.key === COMPLETED_KEY) {
                try {
                    setCompletedMissions(e.newValue ? JSON.parse(e.newValue) : []);
                } catch {
                    setCompletedMissions([]);
                }
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

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

        navigate("/map", {
            state: {
                mission: mission
            }
        });
    };

    const handleCompleteMission = (mission) => {
        try {
            const raw = localStorage.getItem(COMPLETED_KEY);
            const completed = raw ? JSON.parse(raw) : [];

            if (!completed.includes(mission.id)) {
                const next = [...completed, mission.id];
                localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
                setCompletedMissions(next);
                setLevel(prev => prev + 5);
            }
        } catch {
            localStorage.setItem(COMPLETED_KEY, JSON.stringify([mission.id]));
            setCompletedMissions([mission.id]);
            setLevel(prev => prev + 5);
        }

        setSelectedMission(null);
    };

    const isCompleted = (missionId) => completedMissions.includes(missionId);

    return (
        <div className="profile-container">

            <aside className="sidebar">
                <div className="sidebar-logo-mini">SHADOWMAP</div>

                <h2>Actividad</h2>
                <ul>
                    <li data-tooltip="Número total de rutas que has visitado">
                        <span>Rutas visitadas</span><span>{routesVisited || 0}</span>
                    </li>

                    <li data-tooltip="Rutas creadas por ti en ShadowMap">
                        <span>Rutas creadas</span><span>{routesCreated || 0}</span>
                    </li>

                    <li data-tooltip="Rutas que otros usuarios han compartido contigo">
                        <span>Compartidas conmigo</span><span>{routesShared || 0}</span>
                    </li>
                </ul>

                <h2>Puntuación</h2>
                <ul>
                    <li data-tooltip="Puntos obtenidos explorando misiones y rutas">
                        <span>Explorador</span><span>{explorerScore || 0}</span>
                    </li>

                    <li data-tooltip="Puntos obtenidos creando rutas">
                        <span>Creador</span><span>{creatorScore || 0}</span>
                    </li>
                </ul>

                <h2>Estado</h2>
                <ul>
                    <li data-tooltip="Tu tipo de cuenta actual">
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
                        <img src={avatarInfo?.src} alt="avatar" className="profile-avatar" />
                    </div>

                    <div className="profile-info">
                        <h2>{shortname}</h2>

                        {premiumLevel && (
                            <p className="premium-level-display">
                                Nivel {premiumLevel} — {premiumNick}
                            </p>
                        )}

                        <p className="lore-text">
                            <strong>{lore?.title}:</strong> {lore?.origin}
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
                        completedIds={completedMissions}
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

                <section className="profile-missions" style={{ marginTop: 18 }}>
                    <h3>Todas las misiones</h3>
                    <div className="saved-routes-list">
                        {missions.map(m => {
                            const done = isCompleted(m.id);
                            return (
                                <div key={m.id} className={`saved-route-card ${done ? "mission-completed" : ""}`}>
                                    <div className="route-header">
                                        <strong className="route-name">{m.name}</strong>
                                        <div>
                                            {!done && (
                                                <button className="small-btn" onClick={() => handleSelectMission(m)}>
                                                    Ir a misión
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="route-meta">
                                        <span className="route-info">{m.description}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

            </main>

        </div>
    );
};

export default Profile;

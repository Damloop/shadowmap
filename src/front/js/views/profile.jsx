import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";
import { getAvatarLore } from "../../data/avatarLore";
import { missions } from "../../data/missions";
import { MissionCarousel } from "../component/MissionCarousel.jsx";
import "../../styles/profile.css";

const Profile = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [level, setLevel] = useState(0);
    const [completedMissions, setCompletedMissions] = useState([]);
    const [selectedMission, setSelectedMission] = useState(null);

    // PEDIR LOCALIZACIÓN AL ENTRAR
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            () => {},
            () => {
                alert("ShadowMap requiere acceso a tu localización para funcionar.");
            }
        );
    }, []);

    useEffect(() => {
        if (!store.user) actions.getCurrentUser();
    }, []);

    if (!store.user) return <div className="profile-main">Cargando identidad...</div>;

    const {
        avatar,
        shortname,
        routesVisited,
        routesCreated,
        routesShared,
        explorerScore,
        creatorScore,
        isPremium
    } = store.user;

    const lore = getAvatarLore(avatar);

    const suggestedRoutes = [
        "Sector 9 — Señal intermitente",
        "Bosque de Blackwood — Eco residual",
        "Túnel 14 — Anomalía térmica",
        "Distrito 7 — Patrón no identificado"
    ];

    // DESBLOQUEAR SOLO LA MISIÓN 4
    useEffect(() => {
        if (completedMissions.length >= 3) {
            missions.forEach(m => {
                if (m.id === 4) m.locked = false;
            });
        }
    }, [completedMissions]);

    const handleSelectMission = (mission) => {
        if (mission.locked) return;
        setSelectedMission(mission);
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

            {/* SIDEBAR */}
            <aside className="sidebar">
                <h2>Actividad</h2>
                <ul>
                    <li><span>Rutas visitadas</span><span>{routesVisited || 0}</span></li>
                    <li><span>Rutas creadas</span><span>{routesCreated || 0}</span></li>
                    <li><span>Compartidas conmigo</span><span>{routesShared || 0}</span></li>
                </ul>

                <h2>Puntuación</h2>
                <ul>
                    <li><span>Explorador</span><span>{explorerScore || 0}</span></li>
                    <li><span>Creador</span><span>{creatorScore || 0}</span></li>
                </ul>

                <h2>Estado</h2>
                <ul>
                    <li><span>Cuenta</span><span>{isPremium ? "Premium" : "Estándar"}</span></li>
                </ul>

                {!isPremium && (
                    <p className="sidebar-note">
                        Avatar fijado. Solo Premium puede reconfigurar identidad.
                    </p>
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

            {/* MAIN */}
            <main className="profile-main">
                <h1 className="shadow-title">SHADOWMAP</h1>

                <div className="profile-card">
                    <img src={lore.src} className="profile-avatar" />

                    <div className="profile-info">
                        <h2>{shortname}</h2>
                        <p className="title">Nivel {level}</p>

                        <p style={{
                            marginTop: "20px",
                            fontSize: "15px",
                            lineHeight: "1.6",
                            maxWidth: "600px",
                            color: "#d4d4d4"
                        }}>
                            <strong>{lore.title}:</strong> {lore.origin}
                        </p>
                    </div>
                </div>

                <div className="avatar-selector">
                    <h3>¿Por dónde empezamos?</h3>

                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {suggestedRoutes.map((route, i) => (
                            <li key={i} className="suggested-route">
                                {route}
                            </li>
                        ))}
                    </ul>
                </div>

                <h3 className="missions-title">Misiones</h3>

                <MissionCarousel
                    missions={[
                        ...missions.filter(m => !m.locked),
                        ...missions.filter(m => m.locked).slice(0, 1)
                    ]}
                    onSelect={(m) => handleSelectMission(m)}
                />

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

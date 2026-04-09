// /src/front/js/views/profile.jsx
import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";
import { getAvatarLore } from "../../data/avatarLore";
import "../../styles/profile.css";

const Profile = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

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

                {/* PROFILE CARD */}
                <div className="profile-card">
                    <img src={lore.src} className="profile-avatar" />

                    <div className="profile-info">
                        <h2>{shortname}</h2>

                        {/* NIVEL */}
                        <p className="title">Nivel {lore.level}</p>

                        {/* HISTORIA */}
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

                {/* RUTAS SUGERIDAS */}
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
            </main>

        </div>
    );
};

export default Profile;

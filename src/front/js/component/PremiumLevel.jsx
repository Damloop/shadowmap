import React, { useState } from "react";
import "../../styles/premium.css";

const LEVEL_UPGRADES = {
    1: ["Mapa más nítido", "Rutas básicas optimizadas", "Perfil mejorado"],
    2: ["Análisis de zonas", "Historial extendido", "Velocidad x1.2"],
    3: ["Misiones avanzadas", "Capas adicionales", "Rutas inteligentes"],
    4: ["Alertas de actividad", "Mapa nocturno mejorado", "Velocidad x1.4"],
    5: ["Estadísticas premium", "Rutas predictivas", "Exploración profunda"],
    6: ["Análisis térmico", "Mapa espectral", "Velocidad x1.6"],
    7: ["Misiones ocultas", "Rutas secretas", "Detección avanzada"],
    8: ["Exploración remota", "Capas experimentales", "Velocidad x1.8"],
    9: ["Análisis completo", "Mapa hiperrealista", "Rutas élite"],
    10: ["Modo Maestro", "Acceso total", "Velocidad máxima"]
};

// ⭐ SOBRENOMBRES POR NIVEL
const LEVEL_TITLES = {
    1: "Iniciado",
    2: "Rastreador",
    3: "Explorador Sombrío",
    4: "Vigilante",
    5: "Cazador de Ecos",
    6: "Tejedor de Rutas",
    7: "Señor del Mapa",
    8: "Oráculo del Terreno",
    9: "Maestro del Velo",
    10: "Dios de ShadowMap"
};

const PremiumLevel = () => {
    const [level, setLevel] = useState(
        parseInt(sessionStorage.getItem("premiumLevel") || "1")
    );

    const [animating, setAnimating] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const [showParticles, setShowParticles] = useState(false);
    const [showAscendMessage, setShowAscendMessage] = useState(false);

    const ascend = () => {
        if (level >= 10) return;

        const newLevel = level + 1;
        sessionStorage.setItem("premiumLevel", newLevel);
        setLevel(newLevel);

        // Animaciones
        setAnimating(true);
        setShowFlash(true);
        setShowParticles(true);
        setShowAscendMessage(true);

        setTimeout(() => setShowFlash(false), 600);
        setTimeout(() => setShowParticles(false), 1200);
        setTimeout(() => setAnimating(false), 1500);
        setTimeout(() => setShowAscendMessage(false), 2000);
    };

    return (
        <div className="premium-card level-container">
            <h2 className="premium-section-title">Nivel Premium</h2>

            <div className={`level-box ${animating ? "level-anim" : ""}`}>
                <h1 className="level-number">
                    Nivel {level}
                </h1>

                {/* ⭐ SOBRENOMBRE */}
                <p className="level-title">
                    {LEVEL_TITLES[level]}
                </p>

                <button
                    className="premium-button"
                    onClick={ascend}
                    disabled={level >= 10}
                >
                    {level < 10 ? "Sellar ascenso" : "Ascenso completado"}
                </button>
            </div>

            {showAscendMessage && (
                <div className="ascend-message">Ascenso logrado</div>
            )}

            {showFlash && <div className="level-flash"></div>}
            {showParticles && <div className="level-particles"></div>}
        </div>
    );
};

export default PremiumLevel;

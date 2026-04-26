import React from "react";
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

const PremiumDashboard = ({ level }) => {
    const upgrades = LEVEL_UPGRADES[level] || [];

    return (
        <div className="premium-card">
            <h2 className="premium-section-title">Panel Premium</h2>

            <div className="premium-dashboard-grid">
                {upgrades.map((upgrade, index) => (
                    <div key={index} className="premium-dashboard-item">
                        <h3>✨ {upgrade}</h3>
                        <p>Desbloqueado en nivel {level}.</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PremiumDashboard;

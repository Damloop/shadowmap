// src/front/js/component/PremiumLevel.jsx

import React, { useState, useEffect } from "react";
import "../../styles/premium.css";

const nicknames = {
    1: "Explorador del Velo",
    2: "Rastreador Umbrío",
    3: "Navegante Espectral",
    4: "Guardián del Umbral",
    5: "Oráculo del Velo",
    6: "Vigía Arcano",
    7: "Adivino de Penumbra",
    8: "Iluminado del Abismo",
    9: "Ascendido Eterno",
    10: "Soberano de ShadowMap"
};

const upgrades = {
    1: [
        { name: "Eco de Ubicación", desc: "Muestra un rastro tenue de tus pasos recientes." },
        { name: "Sombras de Precisión", desc: "Los marcadores se colocan con mayor exactitud." },
        { name: "Visión Nocturna Suave", desc: "Ilumina ligeramente zonas oscuras del mapa." }
    ],
    2: [
        { name: "Rutas Susurradas", desc: "Sugiere caminos alternativos según tu posición." },
        { name: "Marcadores Inteligentes", desc: "Detecta zonas de interés automáticamente." },
        { name: "Silencio Cartográfico", desc: "Reduce ruido visual en el mapa." }
    ],
    3: [
        { name: "Sombras Reactivas", desc: "El mapa reacciona a tu movimiento." },
        { name: "Rastreo Oculto", desc: "Sigue entidades invisibles (solo visual)." },
        { name: "Análisis de Terreno", desc: "Resalta zonas densas o peligrosas." }
    ],
    4: [
        { name: "Ecos del Pasado", desc: "Muestra rutas antiguas en el mapa." },
        { name: "Visión Astral", desc: "Resalta puntos energéticos ocultos." },
        { name: "Sombras Vivientes", desc: "Sombras animadas en el mapa." }
    ],
    5: [
        { name: "Proyección de Ruta", desc: "Predice tu camino probable." },
        { name: "Mapa Astral", desc: "Capa visual alternativa basada en energía." },
        { name: "Rutas Fantasma", desc: "Líneas temporales que desaparecen." }
    ],
    6: [
        { name: "Sombras Inteligentes", desc: "Alertan zonas de interés cercanas." },
        { name: "Predicción Avanzada", desc: "Sugiere rutas óptimas." },
        { name: "Ecos Remotos", desc: "Detecta actividad lejana." }
    ],
    7: [
        { name: "Rutas Paralelas", desc: "Caminos alternativos ocultos." },
        { name: "Sombras Cuánticas", desc: "Marcadores que cambian según contexto." },
        { name: "Visión Remota", desc: "Permite ver zonas alejadas." }
    ],
    8: [
        { name: "Ecos Infinitos", desc: "Registra actividad pasada y futura." },
        { name: "Mapa Fractal", desc: "Capa visual multidimensional." },
        { name: "Sombras Eternas", desc: "Marcadores permanentes." }
    ],
    9: [
        { name: "Rutas Divinas", desc: "Caminos perfectos y optimizados." },
        { name: "Sombras Supremas", desc: "Marcadores con poder total." },
        { name: "Ecos Totales", desc: "Acceso a toda la información espectral." }
    ],
    10: [
        { name: "Control Absoluto", desc: "Dominio total del mapa." },
        { name: "Visión Omnisciente", desc: "Todo es visible." },
        { name: "Sombras Infinitas", desc: "Marcadores ilimitados." }
    ]
};

const PremiumLevel = () => {
    const [level, setLevel] = useState(
        parseInt(sessionStorage.getItem("premiumLevel") || "1")
    );

    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        sessionStorage.setItem("premiumLevel", level.toString());
        sessionStorage.setItem("premiumNick", nicknames[level]);
    }, [level]);

    const handleLevelUp = () => {
        if (level >= 10) return;

        setAnimating(true);

        setTimeout(() => {
            setLevel(level + 1);
            setAnimating(false);
        }, 1200);
    };

    if (level === 10) {
        return (
            <div className="premium-max-container">
                <div className="premium-max-title">NIVEL MÁXIMO</div>
                <div className="premium-max-glow">10</div>
                <div className="premium-max-msg">
                    Has alcanzado el dominio absoluto del Velo.
                </div>

                <div className="premium-max-upgrades">
                    {upgrades[10].map((u, i) => (
                        <div key={i} className="premium-max-item">
                            <strong>{u.name}</strong>
                            <p>{u.desc}</p>
                        </div>
                    ))}
                </div>

                <button
                    className="premium-max-btn"
                    onClick={() => window.history.back()}
                >
                    Volver
                </button>
            </div>
        );
    }

    return (
        <div className="premium-level-box">

            <h2 className="premium-level-title">Nivel Premium</h2>

            <div className={`level-display ${animating ? "flash" : ""}`}>
                <span className="level-number">{level}</span>
                <span className="nickname">{nicknames[level]}</span>
            </div>

            <button
                className={`level-up-btn magic-btn ${animating ? "disabled" : ""}`}
                onClick={handleLevelUp}
            >
                {level < 10 ? (
                    <>
                        Sellar Ascenso  
                        <span className="price-tag">4,95€</span>
                    </>
                ) : (
                    "Nivel Máximo"
                )}
            </button>

            <div className="premium-upgrades">
                {upgrades[level].map((u, i) => (
                    <div key={i} className="upgrade-item">
                        <strong className="upgrade-name">{u.name}</strong>
                        <p className="upgrade-desc">{u.desc}</p>
                    </div>
                ))}
            </div>

            <div className="premium-back-container">
                <button
                    className="back-button-inline"
                    onClick={() => window.history.back()}
                >
                    Volver
                </button>
            </div>

            {animating && <div className="particle-effect"></div>}
        </div>
    );
};

export default PremiumLevel;

// src/front/js/component/TutorialOverlay.jsx

import React from "react";
import "../../styles/tutorial.css";

export const TutorialOverlay = ({ step = 0, onNext, onClose, mode = "mission" }) => {
    
    const stepsRoutes = [
        {
            title: "Mis rutas",
            text: "Aquí puedes crear tu propia ruta y definir hasta cinco puntos en la versión gratuita."
        },
        {
            title: "Mis rutas",
            text: "Puedes editarla o guardarla para seguir más tarde... ¡incluso compartirla con tus amigos!"
        }
    ];

    const stepsMission = [
        {
            title: "Misión Activa",
            text: "Pulsando en la misión, aparecen los puntos misteriosos cercanos a tu ubicación. Aquí tendrás que cumplir la tarea para poder continuar."
        },
        {
            title: "Misión Activa",
            text: "Marca la misión como completada manualmente cuando lo hayas hecho; te llevará a tu perfil."
        }
    ];

    const steps = mode === "routes" ? stepsRoutes : stepsMission;

    const safeStep = Math.min(Math.max(step, 0), steps.length - 1);
    const current = steps[safeStep];

    return (
        <div className="tutorial-overlay">
            <div className="tutorial-box">

                <button className="tutorial-close" onClick={onClose}>×</button>

                <h2 className="tutorial-title">SHADOWMAP TUTORIAL</h2>
                <h3 className="tutorial-step-title">{current.title}</h3>

                <p className="tutorial-text">{current.text}</p>

                <button className="tutorial-next" onClick={onNext}>
                    {safeStep === steps.length - 1 ? "Empezar" : "Siguiente"}
                </button>
            </div>
        </div>
    );
};

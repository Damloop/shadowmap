// src/front/js/component/TutorialOverlay.jsx

import React from "react";
import "../../styles/tutorial.css";

export const TutorialOverlay = ({ step = 0, onNext, onClose }) => {
    
    const steps = [
        {
            title: "Aceptar la misión",
            text: "Pulsa el recuadro de la misión para recibir puntos cercanos a tu ubicación."
        },
        {
            title: "No estás solo",
            text: "Sigue la misión o traza tu propio camino. Cada decisión deja una huella."
        },
        {
            title: "Confirmar misión",
            text: "Marca la misión como completada manualmente cuando lo hayas hecho; te llevará a tu perfil."
        }
    ];

    const safeStep = Math.min(Math.max(step, 0), steps.length - 1);
    const current = steps[safeStep];

    return (
        <div className="tutorial-overlay">
            <div className="tutorial-box">

                <button className="tutorial-close" onClick={onClose}>×</button>

                <h2 className="tutorial-title">SHADOWMAP</h2>
                <h3 className="tutorial-step-title">{current.title}</h3>

                <p className="tutorial-text">{current.text}</p>

                <button className="tutorial-next" onClick={onNext}>
                    {safeStep === steps.length - 1 ? "Empezar" : "Siguiente"}
                </button>
            </div>
        </div>
    );
};

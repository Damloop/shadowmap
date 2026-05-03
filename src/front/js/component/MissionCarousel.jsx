// src/front/js/component/MissionCarousel.jsx

import React from "react";
import "../../styles/missionCarousel.css";

export const MissionCarousel = ({ missions, onSelect, completedIds = [] }) => {

    if (!missions || missions.length === 0) return null;

    const getDifficultyClass = (difficulty) => {
        if (difficulty === "Fácil") return "easy";
        if (difficulty === "Media") return "medium";
        if (difficulty === "Difícil") return "hard";
        return "";
    };

    const getStars = (difficulty) => {
        if (difficulty === "Fácil") return "⭐";
        if (difficulty === "Media") return "⭐⭐";
        if (difficulty === "Difícil") return "⭐⭐⭐";
        return "";
    };

    const isCompleted = (id) => completedIds.includes(id);

    return (
        <div className="carousel-container">
            <div className="carousel-list">
                {missions.map((m) => {
                    const completed = isCompleted(m.id);

                    return (
                        <div
                            key={m.id}
                            className={`carousel-card 
                                ${getDifficultyClass(m.difficulty)} 
                                ${m.locked ? "locked" : ""} 
                                ${completed ? "completed" : ""}
                            `}
                            onClick={() => {
                                if (!m.locked && !completed) onSelect(m);
                            }}
                            style={{
                                cursor: m.locked || completed ? "not-allowed" : "pointer",
                                opacity: m.locked || completed ? 0.5 : 1
                            }}
                        >
                            {m.locked && <span className="locked-tag">BLOQUEADA</span>}
                            {completed && <span className="completed-tag">COMPLETADA</span>}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                    marginBottom: "6px"
                                }}
                            >
                                <h4 style={{ margin: 0 }}>
                                    <strong>Misión:</strong> {m.name}
                                </h4>

                                <span style={{ fontSize: "14px", opacity: 0.9 }}>
                                    <strong>Nivel:</strong> {m.difficulty} {getStars(m.difficulty)}
                                </span>
                            </div>

                            <p className="mission-description">{m.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
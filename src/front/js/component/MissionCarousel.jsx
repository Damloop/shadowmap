import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/missionCarousel.css";

export const MissionCarousel = ({ missions, onSelect }) => {

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

    return (
        <div className="carousel-container">
            <div className="carousel-list">
                {missions.map((m) => (
                    <div
                        key={m.id}
                        className={`carousel-card ${getDifficultyClass(m.difficulty)} ${
                            m.locked ? "locked" : ""
                        }`}
                        onClick={() => !m.locked && onSelect(m)}
                        style={{
                            cursor: m.locked ? "not-allowed" : "pointer",
                        }}
                    >
                        {m.locked && <span className="locked-tag">BLOQUEADA</span>}

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
                ))}
            </div>
        </div>
    );
};

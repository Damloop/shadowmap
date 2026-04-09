import React, { useRef } from "react";
import "../../styles/missionCarousel.css";

export const MissionCarousel = ({ missions, onSelect }) => {
    const scrollRef = useRef(null);

    const scrollUp = () => {
        scrollRef.current.scrollBy({ top: -200, behavior: "smooth" });
    };

    const scrollDown = () => {
        scrollRef.current.scrollBy({ top: 200, behavior: "smooth" });
    };

    return (
        <div className="carousel-container">
            <button className="carousel-btn up" onClick={scrollUp}>▲</button>

            <div className="carousel-list" ref={scrollRef}>
                {missions.map(m => (
                    <div
                        key={m.id}
                        className={`carousel-card ${m.locked ? "locked" : ""}`}
                        onClick={() => !m.locked && onSelect(m)}
                    >
                        <h4>{m.name}</h4>
                        <p>{m.description}</p>
                        <span className="difficulty">{m.difficulty}</span>

                        {m.locked && <span className="locked-tag">BLOQUEADA</span>}
                    </div>
                ))}
            </div>

            <button className="carousel-btn down" onClick={scrollDown}>▼</button>
        </div>
    );
};

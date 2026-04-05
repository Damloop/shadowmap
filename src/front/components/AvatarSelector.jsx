import React, { useState } from "react";
import { avatars } from "../data/avatarData";
import "../styles/avatarSelector.css";

const AvatarSelector = ({ selected, onSelect }) => {
  const [activeAvatar, setActiveAvatar] = useState(null);

  const handleClick = (avatar) => {
    onSelect(avatar.id);
    setActiveAvatar(avatar);
  };

  const renderStars = (rating) => {
    const stars = Math.round((rating / 100) * 5);
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  return (
    <div className="avatar-wrapper">

      {/* CARRUSEL */}
      <div className="carousel-container">
        <div className="carousel-track">
          {avatars.map((a) => (
            <div
              key={a.id}
              className={`carousel-item ${selected === a.id ? "selected" : ""}`}
              onClick={() => handleClick(a)}
            >
              <img src={a.src} alt={a.label} />
              <p>{a.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PANEL PRINCIPAL */}
      <div className="avatar-panel">
        {activeAvatar ? (
          <>
            <div className="panel-left">
              <img src={activeAvatar.src} alt={activeAvatar.label} />
            </div>

            <div className="panel-right">
              <h3>{activeAvatar.label}</h3>

              <p className="rating">{renderStars(activeAvatar.rating)}</p>

              <div className="stats-grid">
                <div>
                  <h4>Strength</h4>
                  <ul>
                    <li>{activeAvatar.strengths[0]}</li>
                  </ul>
                </div>

                <div>
                  <h4>Weakness</h4>
                  <ul>
                    <li>{activeAvatar.weaknesses[0]}</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="panel-placeholder">
            <p>Select an avatar to view details</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AvatarSelector;

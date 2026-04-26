import React, { useState } from "react";
import { avatarData } from "../../data/avatarData";
import { getAvatarLore } from "../../data/avatarLore";
import "../../styles/avatarSelector.css";

const AvatarSelector = ({ onSelect, selectedAvatar }) => {
  const [index, setIndex] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);

  const avatar = avatarData[index];

  const next = () => setIndex((index + 1) % avatarData.length);
  const prev = () => setIndex((index - 1 + avatarData.length) % avatarData.length);

  const handleSelect = () => {
    setIsSelecting(true);
    setTimeout(() => {
      onSelect(avatar.id);
      setIsSelecting(false);
    }, 600);
  };

  return (
    <div className="avatar-selector-wrapper">

      <h2 className="avatar-title-small">Elige tu identidad</h2>

      <div className="carousel-container">

        <button className="arrow-btn" onClick={prev}>◀</button>

        <div className={`avatar-display ${isSelecting ? "glitch-selected" : ""}`}>

          <img
            src={avatar.src}
            alt={avatar.nombre}
            className="avatar-big pulse"
          />

          <h3 className="avatar-name-big">{avatar.nombre}</h3>

          <div className="stats-box">
            <div className="stat">
              <span>Fuerza</span>
              <div className="bar"><div style={{ width: `${avatar.fuerza * 20}%` }} /></div>
            </div>

            <div className="stat">
              <span>Rapidez</span>
              <div className="bar"><div style={{ width: `${avatar.rapidez * 20}%` }} /></div>
            </div>

            <div className="stat">
              <span>Resistencia</span>
              <div className="bar"><div style={{ width: `${avatar.resistencia * 20}%` }} /></div>
            </div>

            <div className="stat">
              <span>Inteligencia</span>
              <div className="bar"><div style={{ width: `${avatar.inteligencia * 20}%` }} /></div>
            </div>
          </div>

          <button className="select-btn" onClick={handleSelect}>
            Seleccionar
          </button>

        </div>

        <button className="arrow-btn" onClick={next}>▶</button>

      </div>
    </div>
  );
};

export default AvatarSelector;

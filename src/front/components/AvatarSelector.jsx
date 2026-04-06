import React, { useState, useRef } from "react";
import { avatarData } from "../data/avatarData";
import "../styles/avatarSelector.css";

const AvatarSelector = ({ onSelect }) => {
  const [index, setIndex] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const audioRef = useRef(null);

  const reproducirGlitch = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const activarGlitch = () => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 250);
  };

  const siguiente = () => {
    activarGlitch();
    reproducirGlitch();
    const nuevo = (index + 1) % avatarData.length;
    setIndex(nuevo);
    onSelect(avatarData[nuevo].id);
  };

  const anterior = () => {
    activarGlitch();
    reproducirGlitch();
    const nuevo = (index - 1 + avatarData.length) % avatarData.length;
    setIndex(nuevo);
    onSelect(avatarData[nuevo].id);
  };

  const avatar = avatarData[index];

  return (
    <div className="avatar-carrusel-wrapper">

      {/* Sonido glitch */}
      <audio ref={audioRef} src="/sounds/glitch.mp3" preload="auto"></audio>

      <div className="avatar-carrusel">

        {/* BOTONES CORREGIDOS */}
        <button
          type="button"
          className="flecha flecha-izq"
          onClick={anterior}
        >
          ◀
        </button>

        <div className={`avatar-mostrado ${glitch ? "glitch" : ""}`}>
          <img
            src={avatar.src}
            alt={avatar.nombre}
            className="avatar-imagen"
            onError={(e) => (e.target.src = "/avatar/default.png")}
          />
        </div>

        <button
          type="button"
          className="flecha flecha-der"
          onClick={siguiente}
        >
          ▶
        </button>
      </div>

      <div className="avatar-info">
        <h3>{avatar.nombre}</h3>
        <p>{avatar.descripcion}</p>
        <p><strong>Fortaleza:</strong> {avatar.fortaleza}</p>
        <p><strong>Debilidad:</strong> {avatar.debilidad}</p>
      </div>

    </div>
  );
};

export default AvatarSelector;

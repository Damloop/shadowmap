import React, { useState } from "react";
import { avatarData } from "../data/avatarData";
import "../styles/avatarSelector.css"; // aquí importamos el CSS del selector

const AvatarSelector = ({ onSelect, onConfirm }) => {
  const [index, setIndex] = useState(0);
  const [glitch, setGlitch] = useState(false);

  const activarGlitch = () => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 250);
  };

  const siguiente = () => {
    activarGlitch();
    setIndex((index + 1) % avatarData.length);
  };

  const anterior = () => {
    activarGlitch();
    setIndex((index - 1 + avatarData.length) % avatarData.length);
  };

  const avatar = avatarData[index];

  const fijarIdentidad = () => {
    onSelect(avatar.id);
    onConfirm();
  };

  const renderBar = (valor, max = 5) => {
    const porcentaje = (valor / max) * 100;
    const esMaximo = valor === 5;

    return (
      <div className={`stat-bar ${esMaximo ? "stat-max" : ""}`}>
        <div className="stat-fill" style={{ width: `${porcentaje}%` }}></div>
      </div>
    );
  };

  return (
    <div className="avatar-carrusel-wrapper">

      <div className="avatar-carrusel">
        <button className="flecha flecha-izq" onClick={anterior}>◀</button>

        <div className={`avatar-mostrado ${glitch ? "glitch" : ""}`}>
          <img
            src={avatar.src}
            alt={avatar.nombre}
            className="avatar-imagen"
          />
        </div>

        <button className="flecha flecha-der" onClick={siguiente}>▶</button>
      </div>

      <div className="avatar-info">
        <h3>{avatar.nombre}</h3>

        <div className="stat-row"><span>Fuerza</span>{renderBar(avatar.fuerza)}</div>
        <div className="stat-row"><span>Rapidez</span>{renderBar(avatar.rapidez)}</div>
        <div className="stat-row"><span>Resistencia</span>{renderBar(avatar.resistencia)}</div>
        <div className="stat-row"><span>Inteligencia</span>{renderBar(avatar.inteligencia)}</div>
      </div>

      {/* 🔥 BOTÓN FIJAR IDENTIDAD IGUAL QUE EL DE LOGIN */}
      <button className="btn-entrar" onClick={fijarIdentidad}>
        Fijar identidad
      </button>

    </div>
  );
};

export default AvatarSelector;

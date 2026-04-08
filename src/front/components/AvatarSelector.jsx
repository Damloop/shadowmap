import React, { useState, useEffect } from "react";
import { avatarData } from "../data/avatarData";
import "../styles/avatarSelector.css";

const AvatarSelector = ({ onSelect, selected }) => {
  const [index, setIndex] = useState(0);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (selected) {
      const foundIndex = avatarData.findIndex(a => a.id === selected);
      if (foundIndex !== -1) {
        setIndex(foundIndex);
      }
    }
  }, [selected]);

  const activarGlitch = () => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 250);
  };

  const siguiente = () => {
    activarGlitch();
    const nuevo = (index + 1) % avatarData.length;
    setIndex(nuevo);
    onSelect(avatarData[nuevo].id);
  };

  const anterior = () => {
    activarGlitch();
    const nuevo = (index - 1 + avatarData.length) % avatarData.length;
    setIndex(nuevo);
    onSelect(avatarData[nuevo].id);
  };

  const avatar = avatarData[index];

  return (
    <div className="avatar-carrusel-wrapper">

      <div className="avatar-carrusel">
        <button type="button" className="flecha flecha-izq" onClick={anterior}>
          ◀
        </button>

        <div className={`avatar-mostrado ${glitch ? "glitch" : ""}`}>
          <img
            src={avatar.src}
            alt={avatar.nombre}
            className="avatar-imagen"
            onError={e => (e.target.src = "/avatar/default.png")}
          />
        </div>

        <button type="button" className="flecha flecha-der" onClick={siguiente}>
          ▶
        </button>
      </div>

      <div className="avatar-info">
        <h3>{avatar.nombre}</h3>
        <p><strong>Fortaleza:</strong> {avatar.fortaleza}</p>
        <p><strong>Debilidad:</strong> {avatar.debilidad}</p>
      </div>
    </div>
  );
};

export default AvatarSelector;

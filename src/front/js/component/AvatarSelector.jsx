import React, { useState } from "react";
import { avatarData } from "../../data/avatarData";
import "../../styles/avatarSelector.css";

const AvatarSelector = ({ onSelect, onConfirm }) => {
  const [selected, setSelected] = useState(null);

  const handleClick = (avatarId) => {
    setSelected(avatarId);
    onSelect(avatarId);
  };

  return (
    <div className="avatar-selector-wrapper">
      <h2 className="avatar-title">Elige tu identidad</h2>

      <div className="avatar-grid">
        {avatarData.map((item) => (
          <div
            key={item.id}
            className={`avatar-card ${selected === item.id ? "selected" : ""}`}
            onClick={() => handleClick(item.id)}
          >
            <img src={item.img} alt={item.name} className="avatar-img" />
            <p className="avatar-name">{item.name}</p>
          </div>
        ))}
      </div>

      <button
        className="avatar-confirm-btn"
        disabled={!selected}
        onClick={onConfirm}
      >
        Fijar identidad
      </button>
    </div>
  );
};

export default AvatarSelector;

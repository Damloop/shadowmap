import React from "react";
import { avatars } from "../data/avatarData";
import "../styles/avatarSelector.css";

const AvatarSelector = ({ selected, onSelect, disabled }) => {
  return (
    <div className="avatar-grid">
      {avatars.map((a) => (
        <div
          key={a.id}
          className={`avatar-item ${selected === a.id ? "selected" : ""} ${disabled ? "disabled" : ""}`}
          onClick={() => !disabled && onSelect(a.id)}
        >
          <img src={a.src} alt={a.label} />
          <p>{a.label}</p>
        </div>
      ))}
    </div>
  );
};

export default AvatarSelector;

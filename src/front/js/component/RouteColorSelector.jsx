import React, { useContext } from "react";
import { Context } from "../store/appContext";

import blueMarker from "../../img/markers/blue-marker.png";
import greenMarker from "../../img/markers/green-marker.png";
import pinkMarker from "../../img/markers/pink-marker.png";
import redMarker from "../../img/markers/red-marker.png";
import yellowMarker from "../../img/markers/yellow-marker.png";

const COLORS = [
  { id: "blue", label: "Blue anomaly", file: blueMarker },
  { id: "green", label: "Green anomaly", file: greenMarker },
  { id: "pink", label: "Pink anomaly", file: pinkMarker },
  { id: "red", label: "Red anomaly", file: redMarker },
  { id: "yellow", label: "Yellow anomaly", file: yellowMarker }
];

const RouteColorSelector = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="route-color-panel">
      <h3 className="route-color-title">SHADOWMARKER COLOR</h3>

      <div className="route-color-grid">
        {COLORS.map(c => (
          <button
            key={c.id}
            className={
              "route-color-item" +
              (store.markerColor === c.id ? " route-color-item--active" : "")
            }
            onClick={() => actions.setMarkerColor(c.id)}
          >
            <img src={c.file} alt={c.id} className="route-color-icon" />
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RouteColorSelector;

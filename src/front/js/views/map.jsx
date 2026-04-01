import React from "react";
import MapView from "../component/MapView";

export const Map = () => {
  return (
    <div style={{ height: "calc(100vh - 60px)", width: "100%" }}>
      <MapView />
    </div>
  );
};

export default Map;

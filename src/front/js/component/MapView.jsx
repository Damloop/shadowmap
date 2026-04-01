import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para que el marker se vea correctamente
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

L.Marker.prototype.options.icon = defaultIcon;

function MapView() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[40.4168, -3.7038]} // Madrid
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[40.4168, -3.7038]}>
          <Popup>Posición inicial de ShadowMap</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapView;

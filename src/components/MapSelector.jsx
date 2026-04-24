import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

const LocationMarker = ({ setPosition }) => {
  const [position, setLocalPosition] = useState(null);

  useMapEvents({
    click(e) {
      setLocalPosition(e.latlng);
      setPosition(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position} />;
};

export default function MapSelector({ setDestination }) {
  return (
    <MapContainer
      center={[3.4516, -76.5319]}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker setPosition={setDestination} />
    </MapContainer>
  );
}
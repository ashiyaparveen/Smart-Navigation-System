// components/CampusMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import Routing from "./Routing";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const { BaseLayer } = LayersControl;

// Fix default Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function CampusMap({ locations, source, destination, setInstructions }) {
  return (
    <MapContainer center={[10.8285, 77.0608]} zoom={17} className="map">
      <LayersControl position="topright">
        <BaseLayer checked name="Street Map">
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>
        <BaseLayer name="Satellite View">
          <TileLayer
            attribution="Tiles © Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </BaseLayer>
      </LayersControl>

      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup>
            <h3>{loc.name}</h3>
            <p><b>Category:</b> {loc.category}</p>
            <p>{loc.description}</p>
          </Popup>
        </Marker>
      ))}

      <Routing source={source} destination={destination} setInstructions={setInstructions} />
    </MapContainer>
  );
}
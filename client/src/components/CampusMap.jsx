import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, ZoomControl } from "react-leaflet";
import {
  FaMap,
  FaMoon,
  FaSun,
  FaSatellite,
  FaLayerGroup,
  FaUniversity,
  FaHome,
  FaUtensils,
  FaFutbol,
  FaMapMarkerAlt,
  FaBuilding,
  FaHospital,
} from "react-icons/fa";
import { renderToString } from "react-dom/server";
import L from "leaflet";
import Routing from "./Routing";
import LocationModal from "./LocationModal";
import "leaflet/dist/leaflet.css";

/* REMOVE DEFAULT LEAFLET ICON COMPLETELY */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "",
  iconRetinaUrl: "",
  shadowUrl: "",
});

/* MAP THEMES */

const themes = {
  default: {
    icon: <FaMap />,
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  light: {
    icon: <FaSun />,
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  },
  dark: {
    icon: <FaMoon />,
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  },
  satellite: {
    icon: <FaSatellite />,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
  topo: {
    icon: <FaLayerGroup />,
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  },
};

const getIcon = (category, isActive) => {
  let IconComp = FaMapMarkerAlt; 

  switch (category) {
    case "Campus Center":
      IconComp = FaUniversity;
      break;
    case "Religious":
      IconComp = FaMapMarkerAlt; 
      break;
    case "Academic":
      IconComp = FaUniversity;
      break;
    case "Administrative":
      IconComp = FaBuilding;
      break;
    case "Healthcare":
      IconComp = FaHospital;
      break;
    case "Recreational":
      IconComp = FaFutbol;
      break;
    case "Residential":
      IconComp = FaHome;
      break;
    default:
      IconComp = FaMapMarkerAlt;
  }

  return L.divIcon({
    html: `
      <div class="marker-wrapper ${isActive ? "active" : ""}">
        <div class="marker-glow"></div>
        <div class="marker-core">
          ${renderToString(<IconComp />)}
        </div>
      </div>
    `,
  });
};

export default function CampusMap({
  locations,
  source,
  destination,
  setInstructions,
}) {
  const [activeTheme, setActiveTheme] = useState("default");
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <MapContainer center={[10.8285, 77.0608]} zoom={17} className="map">
      <ZoomControl position="bottomright" />
      {/* MAP */}
      <TileLayer key={activeTheme} url={themes[activeTheme].url} />

      {/* THEME SWITCH */}
      <div className={`theme-container ${open ? "open" : ""}`}>
        <button
          className="theme-main-btn"
          onClick={() => setOpen(!open)}
          title={activeTheme.toUpperCase()}
        >
          {themes[activeTheme].icon}
        </button>
        <div className="theme-options">
          {Object.keys(themes).map(
            (key) =>
              key !== activeTheme && (
                <button
                  key={key}
                  className="theme-option-btn"
                  onClick={() => {
                    setActiveTheme(key);
                    setOpen(false);
                  }}
                  title={key.toUpperCase()}
                >
                  {themes[key].icon}
                </button>
              )
          )}
        </div>
      </div>

      {/* MARKERS */}
      {locations.map((loc) => {
        const isActive =
          source?.id === loc.id || destination?.id === loc.id;

        return (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={getIcon(loc.category, isActive)}
            eventHandlers={{
              click: () => setSelectedLocation(loc),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
              {loc.name}
            </Tooltip>
          </Marker>
        );
      })}

      {/* ROUTING */}
      <Routing
        source={source}
        destination={destination}
        setInstructions={setInstructions}
      />

      {/* MODAL */}
      <LocationModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
      
    </MapContainer>
    
  );
}
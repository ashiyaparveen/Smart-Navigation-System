import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const { BaseLayer } = LayersControl;

function Routing({ source, destination }) {

  const map = useMap();

  useEffect(() => {

    if (!source || !destination) return;

    const routing = L.Routing.control({
      waypoints: [
        L.latLng(source.lat, source.lng),
        L.latLng(destination.lat, destination.lng)
      ],
      lineOptions: {
        styles: [{ color: "#1a73e8", weight: 5 }]
      },
      addWaypoints: false,
      draggableWaypoints: false
    }).addTo(map);

    return () => map.removeControl(routing);

  }, [source, destination, map]);

  return null;
}

function CampusMap({ locations, source, destination }) {

  return (

    <MapContainer
      center={[10.8285, 77.0608]}
      zoom={17}
      className="map"
    >

      <LayersControl position="topright">

        {/* Street Map */}

        <BaseLayer checked name="Street Map">
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>

        {/* Satellite View */}

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

      <Routing source={source} destination={destination} />

    </MapContainer>

  );
}

export default CampusMap;
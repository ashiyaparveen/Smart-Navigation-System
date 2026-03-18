// Routing.jsx
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

export default function Routing({ source, destination, setInstructions }) {
  const map = useMap();

  useEffect(() => {
    if (!source || !destination) return;

    const from = L.latLng(source.lat, source.lng);
    const to = L.latLng(destination.lat, destination.lng);

    const routingControl = L.Routing.control({
      waypoints: [from, to],
      routeWhileDragging: true,
      showAlternatives: false,
      addWaypoints: false,
      draggableWaypoints: false,
      createMarker: function() { return null; },
    }).addTo(map);

    routingControl.getContainer().style.display = 'none'; 

    routingControl.on("routesfound", function (e) {
        const route = e.routes[0];
        if (!route) return;

        const steps = route.instructions.map((inst) => {
            const text = inst.text || ""; 
            const distance = inst.distance ? (inst.distance / 1000).toFixed(2) + " km" : "";
            return `${text} (${distance})`;
        });

        setInstructions({ steps });
        });

    return () => {
      if (routingControl) map.removeControl(routingControl);
    };
  }, [source, destination, map, setInstructions]);

  return null;
}

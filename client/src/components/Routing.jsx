import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

export default function Routing({ source, destination, setInstructions }) {
  const map = useMap();

  useEffect(() => {
    if (!source || !destination) return;

    const routing = L.Routing.control({
      waypoints: [
        L.latLng(source.lat, source.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      lineOptions: { styles: [{ color: "#1a73e8", weight: 5 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
    }).addTo(map);

    routing.on("routesfound", function (e) {
      const route = e.routes[0];

      // total route distance/time
      const totalDistance = route.summary.totalDistance; 
      const totalTime = route.summary.totalTime;

      // Match the displayed routing instructions formatting used by Leaflet Routing Machine
      const formatter = new L.Routing.Formatter();

      const steps = route.instructions.map((inst) => {
        const instructionText = formatter.formatInstruction(inst);
        const distanceText = inst.distance ? formatter.formatDistance(inst.distance) : "";
        return distanceText ? `${instructionText} in ${distanceText}` : instructionText;
      });

      setInstructions({ steps, totalTime, totalDistance });
    });

    return () => map.removeControl(routing);
  }, [source, destination, map, setInstructions]);

  return null;
}
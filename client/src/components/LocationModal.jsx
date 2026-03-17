import React from "react";
import { FaTimes, FaMapMarkerAlt, FaTag } from "react-icons/fa";

export default function LocationModal({ location, onClose }) {
  if (!location) return null;

  return (
    <div className="map-modal">
      <button className="close-btn" onClick={onClose}>
        <FaTimes />
      </button>

      <h2>
        <FaMapMarkerAlt /> {location.name}
      </h2>

      <p>
        <FaTag /> <b>Category:</b> {location.category}
      </p>

      <p>{location.description}</p>
    </div>
  );
}
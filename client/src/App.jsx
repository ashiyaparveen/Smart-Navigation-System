// App.jsx
import React, { useState } from "react";
import CampusMap from "./components/CampusMap";
import VoiceButton from "./components/VoiceButton";
import locations from "./data/locations";
import { FaSearch, FaRoute } from "react-icons/fa";
import "./App.css";

export default function App() {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [instructions, setInstructions] = useState({ steps: [] });

  const filtered = locations.filter((loc) =>
    loc.name.toLowerCase().includes(search.toLowerCase())
  );

  const sourceLocation = locations.find((loc) => loc.name === source);
  const destinationLocation = locations.find((loc) => loc.name === destination);

  return (
    <div className="app">
      {/* Search Bar */}
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search campus buildings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Route Panel */}
      <div className="route-panel">
        <FaRoute className="route-icon" />
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">Select Source</option>
          {locations.map((loc) => (
            <option key={loc.id}>{loc.name}</option>
          ))}
        </select>

        <select value={destination} onChange={(e) => setDestination(e.target.value)}>
          <option value="">Select Destination</option>
          {locations.map((loc) => (
            <option key={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>

      <div className="layout">
        <div className="locations-panel">
          {filtered.map((loc) => (
            <div key={loc.id} className="location-card">
              <h4>{loc.name}</h4>
              <p>{loc.category}</p>
            </div>
          ))}
        </div>

        <CampusMap
          locations={filtered}
          source={sourceLocation}
          destination={destinationLocation}
          setInstructions={setInstructions}
        />
      </div>

      {/* Voice Button */}
      {sourceLocation && destinationLocation && (
        <VoiceButton
          displayedInstructions={instructions.steps}
        />
      )}
    </div>
  );
}
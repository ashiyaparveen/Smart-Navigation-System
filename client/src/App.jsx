import React, { useState, useEffect } from "react";
import CampusMap from "./components/CampusMap";
import VoiceButton from "./components/VoiceButton";
import {
  FaSearch,
  FaBars,
  FaTimes, 
  FaUniversity,
  FaHome,
  FaUtensils,
  FaFutbol,
  FaMapMarkerAlt,
  FaBuilding,
  FaHospital,
} from "react-icons/fa";
import "./App.css";
import { getLocations } from "./api/axios";

export default function App() {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [instructions, setInstructions] = useState({ steps: [] });
  const [locations, setLocations] = useState([]);

  const filtered = locations
    .filter((loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((loc) => (category ? loc.category === category : true));

  const sourceLocation = locations.find((loc) => loc.name === source);
  const destinationLocation = locations.find((loc) => loc.name === destination);

  const categories = Array.from(new Set(locations.map((loc) => loc.category))).sort();

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Campus Center":
        return <FaUniversity />;
      case "Religious":
        return <FaMapMarkerAlt />;
      case "Academic":
        return <FaUniversity />;
      case "Administrative":
        return <FaBuilding />;
      case "Healthcare":
        return <FaHospital />;
      case "Recreational":
        return <FaFutbol />;
      case "Residential":
        return <FaHome />;
      default:
        return <FaMapMarkerAlt />;
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await getLocations();
      const formatted = res.data.map((loc) => ({
      ...loc,
      lat: loc.location.coordinates[1],
      lng: loc.location.coordinates[0], 
    }));

    setLocations(formatted);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    if (!instructions.steps || instructions.steps.length === 0) {
      setVisibleSteps(0);
      return;
    }

    setVisibleSteps(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setVisibleSteps(current);
      if (current >= instructions.steps.length) {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [instructions.steps]);

  return (
    <div className="app">
      <button
        className="hamburger"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar__header">
          <h2>Navigation</h2>
        </div>
        <div className="sidebar__section">
          <label>Category</label>
          <div className="category-icons">
            <button
              className={!category ? "active" : ""}
              onClick={() => setCategory("")}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                className={category === cat ? "active" : ""}
                onClick={() => setCategory(cat)}
                title={cat}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar__section">
          <label htmlFor="source">Source</label>
          <select id="source" value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">Select Source</option>
            {filtered.map((loc) => (
              <option key={loc._id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sidebar__section">
          <label htmlFor="destination">Destination</label>
          <select id="destination" value={destination} onChange={(e) => setDestination(e.target.value)}>
            <option value="">Select Destination</option>
            {filtered.map((loc) => (
              <option key={loc._id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sidebar__section sidebar__instructions">
          <h3>Instructions</h3>
          {sourceLocation && destinationLocation ? (
            instructions.steps.length > 0 ? (
              <ol className="sidebar__instructions">
                {instructions.steps.map((step, idx) => (
                  <li
                    key={idx}
                    style={{ animation: `fadeIn 2s forwards`, animationDelay: `${idx * 2}s` }}
                  >
                    {step}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="muted">Calculating route...</p>
            )
          ) : (
            <p className="muted">Select source + destination to see directions.</p>
          )}
        </div>
      </div>

      <CampusMap
        locations={filtered}
        source={sourceLocation}
        destination={destinationLocation}
        setInstructions={setInstructions}
      />

      <div className={`top-right ${sidebarOpen ? "shifted" : ""}`}>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search campus buildings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {sourceLocation && destinationLocation && (
        <VoiceButton displayedInstructions={instructions.steps} />
      )}
    </div>
  );
}

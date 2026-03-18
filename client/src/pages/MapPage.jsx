import React, { useState, useEffect } from "react";
import CampusMap from "../components/CampusMap";
import VoiceButton from "../components/VoiceButton";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaRoute,
  FaUniversity,
  FaHome,
  FaUtensils,
  FaFutbol,
  FaMapMarkerAlt,
  FaBuilding,
  FaHospital,
} from "react-icons/fa";
import "../App.css";
import { getLocations } from "../api/axios";

export default function MapPage() {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [instructions, setInstructions] = useState({ steps: [] });
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [tracking, setTracking] = useState(false);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await getLocations();
        const formatted = res.data.map((loc) => ({
          ...loc,
          lat: loc.location.coordinates[1],
          lng: loc.location.coordinates[0],
        }));
        setLocations(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLocations();
  }, []);

  // Watch user location only when tracking live route
  useEffect(() => {
    if (!tracking) return;

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [tracking]);

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
    if (current >= instructions.steps.length) clearInterval(interval);
  }, 600); // 600ms per step (adjust to slow/fast)

  return () => clearInterval(interval);
}, [instructions.steps]);

  const filtered = locations
    .filter((loc) => loc.name.toLowerCase().includes(search.toLowerCase()))
    .filter((loc) => (category ? loc.category === category : true));

  const sourceLocation = locations.find((loc) => loc.name === source);
  const destinationLocation = locations.find((loc) => loc.name === destination);

  // Category icons
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

  const categories = Array.from(new Set(locations.map((loc) => loc.category))).sort();

  return (
    <div className="app">
      {/* Sidebar toggle */}
      <button
        className="hamburger"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>Navigation</h2>

        <div className="sidebar__section">
          <label>Category</label>
          <div className="category-icons">
            <button onClick={() => setCategory("")} className={!category ? "active" : ""}>All</button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={category === cat ? "active" : ""}
                onClick={() => setCategory(cat)}
                title={cat}
              >
                {getCategoryIcon(cat)} <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar__section">
          <label>Source</label>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">Select Source</option>
            {filtered.map((loc) => (
              <option key={loc._id} value={loc.name}>{loc.name}</option>
            ))}
          </select>
        </div>

        <div className="sidebar__section">
          <label>Destination</label>
          <select value={destination} onChange={(e) => setDestination(e.target.value)}>
            <option value="">Select Destination</option>
            {filtered.map((loc) => (
              <option key={loc._id} value={loc.name}>{loc.name}</option>
            ))}
          </select>
        </div>

       <div className="sidebar__section sidebar__instructions">
  <h3>Instructions</h3>
  {instructions.steps.length > 0 ? (
    <ol>
      {instructions.steps.slice(0, visibleSteps).map((step, idx) => (
        <li
          key={idx}
          style={{
            animation: `fadeIn 2s forwards`,
            animationDelay: `${idx * 2}s`,
          }}
        >
          {step}
        </li>
      ))}
    </ol>
  ) : (
    <p className="muted">Select source + destination to see directions.</p>
  )}
</div>
      </div>

      {/* Campus Map */}
      <CampusMap
        locations={filtered}
        source={sourceLocation}
        destination={destinationLocation}
        setInstructions={setInstructions}
        userLocation={userLocation}
        tracking={tracking}
      />

      {/* Voice instructions */}
      {destinationLocation && <VoiceButton displayedInstructions={instructions.steps} />}

      {/* Direction Buttons */}
      <div className="directions-buttons">
        {destination && (
          <button className="directions-btn" onClick={() => setTracking(true)} title="live direction">
            <FaRoute />
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="top-right search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search campus..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}

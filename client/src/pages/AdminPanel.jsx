import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Tooltip } from "react-leaflet";
import L from "leaflet";
import {
  FaTrash,
  FaEdit,
  FaMapMarkerAlt,
  FaUniversity,
  FaHome,
  FaFutbol,
  FaHospital,
  FaBuilding,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { renderToString } from "react-dom/server";
import "leaflet/dist/leaflet.css";
import { getLocations, createLocation, updateLocation, deleteLocation } from "../api/axios";
import "./css/admin.css";

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: "", iconRetinaUrl: "", shadowUrl: "" });

// Categories
const categories = [
  { name: "Campus Center", icon: FaUniversity, color: "#1E90FF" },
  { name: "Religious", icon: FaMapMarkerAlt, color: "#8B4513" },
  { name: "Academic", icon: FaUniversity, color: "#32CD32" },
  { name: "Administrative", icon: FaBuilding, color: "#FF8C00" },
  { name: "Healthcare", icon: FaHospital, color: "#FF1493" },
  { name: "Recreational", icon: FaFutbol, color: "#FFD700" },
  { name: "Residential", icon: FaHome, color: "#A52A2A" },
];

// Marker icon
const getMarkerIcon = (categoryName) => {
  const cat = categories.find(c => c.name === categoryName) || { icon: FaMapMarkerAlt, color: "#FF4C4C" };
  return L.divIcon({
    html: renderToString(<cat.icon style={{ color: cat.color, fontSize: "28px" }} />),
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
};

export default function AdminPanel() {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", description: "", lat: "", lng: "" });
  const [editingId, setEditingId] = useState(null);
  const [theme, setTheme] = useState("light");

  const fetchLocations = async () => {
    try {
      const res = await getLocations();
      setLocations(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchLocations(); }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        };

        console.log("Sending payload:", payload);
        if (editingId) {
        await updateLocation(editingId, payload);
        } else {
        await createLocation(payload);
        }

        setForm({ name: "", category: "", description: "", lat: "", lng: "" });
        setEditingId(null);
        fetchLocations();
    } catch (err) {
        console.error(err);
    }
    };

  const handleDelete = async (id) => {
    try { await deleteLocation(id); fetchLocations(); } 
    catch (err) { console.error(err); }
  };

  const handleEdit = (loc) => {
    setForm({
      name: loc.name,
      category: loc.category,
      description: loc.description,
      lat: loc.location.coordinates[1],
      lng: loc.location.coordinates[0],
    });
    setEditingId(loc._id);
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) { setForm({ ...form, lat: e.latlng.lat, lng: e.latlng.lng }); },
    });
    return null;
  };

  const selectedCat = categories.find(c => c.name === form.category);

  return (
    <div className={`admin-container ${theme}`}>
      {/* Theme Toggle */}
      <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? <FaMoon /> : <FaSun />}
      </button>

      <h1>Campus Admin Panel</h1>

      <div className="top-section">
        {/* Form */}
        <div className="form-card">
          <h2>{editingId ? "Edit Location" : "Add New Location"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <div className="category-select">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {selectedCat && <selectedCat.icon style={{ color: selectedCat.color, fontSize: "28px", marginLeft: "10px" }} />}
            </div>

            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Latitude"
              value={form.lat}
              onChange={(e) => setForm({ ...form, lat: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Longitude"
              value={form.lng}
              onChange={(e) => setForm({ ...form, lng: e.target.value })}
              required
            />
            <button type="submit">{editingId ? "Update Location" : "Add Location"}</button>
          </form>
          <p>Click on the map to auto-fill Latitude and Longitude.</p>
        </div>

        {/* Map */}
        <div className="map-card">
          <MapContainer center={[10.8285, 77.0608]} zoom={17} className="map-box">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
            {locations.map((loc) => (
              <Marker
                key={loc._id}
                position={[loc.location.coordinates[1], loc.location.coordinates[0]]}
                icon={getMarkerIcon(loc.category)}
              >
                <Tooltip>{loc.name}</Tooltip>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <h2>Existing Locations</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Coordinates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc._id}>
                <td>{loc.name}</td>
                <td>{loc.category}</td>
                <td>{loc.description}</td>
                <td>{`${loc.location.coordinates[1]}, ${loc.location.coordinates[0]}`}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(loc)}><FaEdit /></button>
                  <button className="delete-btn" onClick={() => handleDelete(loc._id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
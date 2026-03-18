import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CampusMapPage from "./pages/MapPage";  // Your map page
import AdminPanel from "./pages/AdminPanel";        // Admin panel
import { FaMap, FaUserShield } from "react-icons/fa";
import "./App.css";

export default function App() {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<CampusMapPage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
    </Router>
  );
}
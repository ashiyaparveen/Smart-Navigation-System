import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CampusMapPage from "./pages/MapPage";  // Your map page
import AdminPanel from "./pages/AdminPanel";        // Admin panel
import { FaMap, FaUserShield } from "react-icons/fa";
import "./App.css";

export default function App() {
  return (
    <Router>
      {/* <div className="app-container min-h-screen flex flex-col">
        {/* Navigation 
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Campus Navigator</h1>
          <div className="space-x-4">
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-yellow-300"
            >
              <FaMap /> Map
            </Link>
            <Link
              to="/admin"
              className="flex items-center gap-1 hover:text-yellow-300"
            >
              <FaUserShield /> Admin
            </Link>
          </div>
        </nav>

        {/* Routes 
        <main className="flex-1 p-4 bg-gray-100"> */}
          <Routes>
            <Route path="/" element={<CampusMapPage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        {/* </main>

        {/* Footer 
        <footer className="bg-blue-600 text-white p-2 text-center">
          © 2026 Campus Navigator
        </footer>
      </div> */}
    </Router>
  );
}
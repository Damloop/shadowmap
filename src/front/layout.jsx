import React from "react";
import { Routes, Route } from "react-router-dom";

// IMPORTS
import Login from "./js/views/login.jsx";
import Register from "./js/views/register.jsx";
import Profile from "./js/views/profile.jsx";
import MapaCentral from "./js/views/map.jsx"; // <-- AÑADE TU MAPA AQUÍ

const Layout = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />

            {/* 🔥 ESTA ES LA RUTA DEL MAPA */}
            <Route path="/map" element={<MapaCentral />} />
        </Routes>
    );
};

export default Layout;

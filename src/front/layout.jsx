// src/front/layout.jsx

import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./js/component/scrollToTop";

// VIEWS
import Login from "./js/views/login.jsx";
import Register from "./js/views/register.jsx";
import Profile from "./js/views/profile.jsx";
import Recover from "./js/views/recover.jsx";
import ResetPassword from "./js/views/resetPassword.jsx";
import MapView from "./js/views/map.jsx";
import PlaceDetails from "./js/views/placeDetails.jsx";

// 🔥 Sonido principal
import glitchPulse2 from "./sounds/glitch-pulse2.mp3";

// PROTECCIÓN DE RUTAS
const PrivateRoute = ({ children }) => {
    const token = sessionStorage.getItem("token");
    return token ? children : <Login />;
};

const Layout = () => {
    const location = useLocation();

    // 🔥 Sonido + eco paranormal al cambiar de pantalla
    useEffect(() => {
        const base = new Audio(glitchPulse2);
        base.volume = 0.6;
        base.play().catch(() => {});

        // Eco suave (delay 120ms)
        setTimeout(() => {
            const echo = new Audio(glitchPulse2);
            echo.volume = 0.25; // eco más suave
            echo.play().catch(() => {});
        }, 120);

    }, [location.pathname]);

    return (
        <>
            <ScrollToTop />

            <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recover" element={<Recover />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* PRIVATE ROUTES */}
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/map"
                    element={
                        <PrivateRoute>
                            <MapView />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/place-details/:id"
                    element={
                        <PrivateRoute>
                            <PlaceDetails />
                        </PrivateRoute>
                    }
                />

                {/* 404 → LOGIN */}
                <Route path="*" element={<Login />} />
            </Routes>
        </>
    );
};

export default Layout;

import React, { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./js/component/scrollToTop";

import Login from "./js/views/login.jsx";
import Register from "./js/views/register.jsx";
import Profile from "./js/views/profile.jsx";
import Recover from "./js/views/recover.jsx";
import ResetPassword from "./js/views/resetPassword.jsx";
import MapView from "./js/views/map.jsx";
import PlaceDetails from "./js/views/placeDetails.jsx";
import PremiumPage from "./js/views/premiumPage.jsx";
import PremiumLevel from "./js/component/PremiumLevel.jsx";

import introSound from "./sounds/login_register.mp3";

const PrivateRoute = ({ children }) => {
    const token = sessionStorage.getItem("token");
    return token ? children : <Login />;
};

const Layout = () => {
    const location = useLocation();
    const introPlayed = useRef(false);

    useEffect(() => {
        if (!introPlayed.current && location.pathname === "/login") {
            const audio = new Audio(introSound);
            audio.volume = 0.6;
            audio.play().catch(() => {});
            introPlayed.current = true;
        }
    }, [location.pathname]);

    return (
        <>
            <ScrollToTop />

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recover" element={<Recover />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

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

                <Route
                    path="/premium"
                    element={
                        <PrivateRoute>
                            <PremiumPage />
                        </PrivateRoute>
                    }
                />

                <Route path="*" element={<Login />} />
            </Routes>
        </>
    );
};

export default Layout;

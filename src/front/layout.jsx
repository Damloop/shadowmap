// src/front/layout.jsx

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./js/views/login.jsx";
import Register from "./js/views/register.jsx";
import Map from "./js/views/map.jsx";
import Profile from "./js/views/profile.jsx";
import PremiumPage from "./js/views/premiumPage.jsx";
import Recover from "./js/views/recover.jsx";
import ResetPassword from "./js/views/resetPassword.jsx";
import AddPlace from "./js/views/addPlace.jsx";
import EditPlace from "./js/views/editPlace.jsx";
import PlaceDetails from "./js/views/placeDetails.jsx";

import RoutesPage from "./js/views/routes.jsx";   

import ProtectedRoute from "./js/component/ProtectedRoute.jsx";

const Layout = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/map"
                    element={
                        <ProtectedRoute>
                            <Map />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/premium"
                    element={
                        <ProtectedRoute>
                            <PremiumPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/recover" element={<Recover />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route
                    path="/add-place"
                    element={
                        <ProtectedRoute>
                            <AddPlace />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/edit-place/:id"
                    element={
                        <ProtectedRoute>
                            <EditPlace />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/place/:id"
                    element={
                        <ProtectedRoute>
                            <PlaceDetails />
                        </ProtectedRoute>
                    }
                />

                {/* 👇 NUEVA RUTA PARA VER RUTAS GUARDADAS */}
                <Route
                    path="/routes"
                    element={
                        <ProtectedRoute>
                            <RoutesPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<h1>Not found</h1>} />

            </Routes>
        </BrowserRouter>
    );
};

export default Layout;

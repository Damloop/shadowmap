import React, { useEffect, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import injectContext, { Context } from "./js/store/appContext.jsx";

// VIEWS
import Login from "./js/views/login.jsx";
import Register from "./js/views/register.jsx";
import Profile from "./js/views/profile.jsx";
import Map from "./js/views/map.jsx";
import AddPlace from "./js/views/addPlace.jsx";
import EditPlace from "./js/views/editPlace.jsx";
import PlaceDetails from "./js/views/placeDetails.jsx";
import Premium from "./js/views/premium.jsx";
import Recover from "./js/views/recover.jsx";

// PROTECTED ROUTE
import ProtectedRoute from "./js/component/ProtectedRoute.jsx";

const Layout = () => {
    const { actions } = useContext(Context);

    useEffect(() => {
        actions.syncTokenFromSessionStore();
    }, []);

    return (
        <Routes>

            {/* RUTAS PÚBLICAS */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recover" element={<Recover />} />

            {/* MAPA PROTEGIDO */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Map />
                    </ProtectedRoute>
                }
            />

            {/* RUTAS PROTEGIDAS */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

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

            <Route
                path="/premium"
                element={
                    <ProtectedRoute>
                        <Premium />
                    </ProtectedRoute>
                }
            />

            {/* CUALQUIER OTRA RUTA → LOGIN */}
            <Route path="*" element={<Login />} />
        </Routes>
    );
};

export default injectContext(Layout);

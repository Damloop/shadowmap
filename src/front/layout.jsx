import React, { useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import injectContext, { Context } from "./js/store/appContext.jsx";

// VIEWS
import Login from "./js/views/login.jsx";
import Register from "./js/views/register.jsx";
import Profile from "./js/views/profile.jsx";
import Map from "./js/views/map.jsx";
import AddPlace from "./js/views/addPlace.jsx";
import PlaceDetails from "./js/views/placeDetails.jsx";
import Premium from "./js/views/premium.jsx";
import Recover from "./js/views/recover.jsx";

// PROTECTED ROUTE
import ProtectedRoute from "./js/component/ProtectedRoute.jsx";

const Layout = () => {
    const { actions } = useContext(Context);

    // Al cargar la app, sincronizamos el token desde sessionStorage
    useEffect(() => {
        actions.syncTokenFromSessionStore();
    }, []);

    return (
        <BrowserRouter>
            <Routes>

                {/* RUTAS PÚBLICAS */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recover" element={<Recover />} />

                {/* MAPA (si quieres protegerlo, te lo hago en 2 segundos) */}
                <Route path="/" element={<Map />} />

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
        </BrowserRouter>
    );
};

export default injectContext(Layout);

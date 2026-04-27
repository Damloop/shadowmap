// src/front/js/component/ProtectedRoute.jsx

import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";

const ProtectedRoute = ({ children }) => {
    const { store, actions } = useContext(Context);

    // Sincronizar token al cargar
    useEffect(() => {
        actions.syncTokenFromSessionStore();
    }, []);

    // Si NO hay token → login
    if (!store.token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token → renderizar el contenido protegido
    return children;
};

export default ProtectedRoute;

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";

const ProtectedRoute = ({ children }) => {
    const { store } = useContext(Context);

    // Si el token no existe → fuera
    if (!store.token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;


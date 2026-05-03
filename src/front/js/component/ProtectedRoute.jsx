// src/front/js/component/ProtectedRoute.jsx

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";

const ProtectedRoute = ({ children }) => {
    const { store } = useContext(Context);

    if (!store.token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
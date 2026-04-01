import React from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";

const ProtectedRoute = ({ children }) => {
    const { store } = React.useContext(Context);

    if (!store.token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;

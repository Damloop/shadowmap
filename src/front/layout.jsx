import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

// IMPORTS CORRECTOS SEGÚN TU ESTRUCTURA
import Login from "./js/views/login.jsx";
import Register from "./js/views/register.jsx";
import Profile from "./js/views/profile.jsx";

const Layout = () => {
    return <Outlet />;
};

const App = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
            </Route>
        </Routes>
    );
};

export default App;

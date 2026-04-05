import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./js/views/login.jsx";
import Register from "./js/views/register.jsx";
import Recover from "./js/views/recover.jsx";
import Map from "./js/views/map.jsx";
import Profile from "./js/views/profile.jsx";

const Layout = () => {
  return (
    <Routes>
      <Route element={<Login />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route element={<Recover />} path="/recover" />
      <Route element={<Map />} path="/map" />
      <Route element={<Profile />} path="/profile" />
    </Routes>
  );
};

export default Layout;

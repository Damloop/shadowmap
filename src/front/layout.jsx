import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import injectContext from "./js/store/appContext.jsx";

// VIEWS
import Login from "./js/views/login.jsx";
import Register from "./js/views/register.jsx";
import Profile from "./js/views/profile.jsx";
import Map from "./js/views/map.jsx";
import AddPlace from "./js/views/addPlace.jsx";
import PlaceDetails from "./js/views/placeDetails.jsx";
import Premium from "./js/views/premium.jsx";
import Recover from "./js/views/recover.jsx";

const Layout = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Map />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-place" element={<AddPlace />} />
                <Route path="/place/:id" element={<PlaceDetails />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/recover" element={<Recover />} />
            </Routes>
        </BrowserRouter>
    );
};

export default injectContext(Layout);

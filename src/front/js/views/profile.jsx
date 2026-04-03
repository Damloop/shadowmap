// src/front/js/views/profile.jsx
import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.jsx";
import "../../styles/profile.css";

const Profile = () => {
    const { store } = useContext(Context);

    // RUTAS EXACTAS según tu carpeta real
    const avatars = [
        "/img/avatar/avatar_silas.jpg",
        "/img/avatar/avatar_elias.jpg",
        "/img/avatar/avatar_rhea.jpg",
        "/img/avatar/avatar_lfrank.jpg",
        "/img/avatar/avatar_unit47.jpg"
    ];

    const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

    return (
        <div className="profile-container">

            {/* SIDEBAR */}
            <aside className="sidebar">
                <h2>Filters</h2>
                <ul>
                    <li>Spectral Parameters</li>
                    <li>All Entities</li>
                    <li>Signal Strength</li>
                    <li>Historical Records</li>
                    <li>Active Scans</li>
                    <li>Archive</li>
                </ul>
            </aside>

            {/* MAIN */}
            <main className="profile-main">

                <h1 className="shadow-title">ShadowMap</h1>

                {/* PROFILE CARD */}
                <div className="profile-card">
                    <img src={selectedAvatar} className="profile-avatar" />

                    <div className="profile-info">
                        <h2>{store.user?.name || "Unknown Operative"}</h2>
                        <p className="title">Senior Investigator</p>

                        <div className="stats">
                            <p><strong>Level:</strong> 42</p>
                            <p><strong>Signal Strength:</strong> 94.2%</p>
                            <p><strong>Total Observations:</strong> 1,402</p>
                            <p><strong>Entity Classification:</strong> Class IV</p>
                            <p><strong>Places Discovered:</strong> 42</p>
                            <p><strong>Member Since:</strong> 2018</p>
                        </div>
                    </div>
                </div>

                {/* AVATAR SELECTOR */}
                <div className="avatar-selector">
                    <h3>Select Your Operative Identity</h3>

                    <div className="avatar-grid">
                        {avatars.map((a, i) => (
                            <img
                                key={i}
                                src={a}
                                className={`avatar-option ${selectedAvatar === a ? "active" : ""}`}
                                onClick={() => setSelectedAvatar(a)}
                            />
                        ))}
                    </div>
                </div>

            </main>

        </div>
    );
};

export default Profile;

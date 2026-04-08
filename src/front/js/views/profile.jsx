import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";
import "../../styles/profile.css";

const Profile = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const API_URL = "https://solid-goldfish-xj5599r4x942vrp4-3001.app.github.dev";

    const avatars = [
        "/avatar/avatar_elias.jpg",
        "/avatar/avatar_lfrank.jpg",
        "/avatar/avatar_rhea.jpg",
        "/avatar/avatar_silas.jpg",
        "/avatar/avatar_unit47.jpg"
    ];

    const [selectedAvatar, setSelectedAvatar] = useState(null);

    useEffect(() => {
        if (!store.user) {
            actions.getCurrentUser();
        }
    }, []);

    useEffect(() => {
        if (store.user?.avatar) {
            const index = store.user.avatar - 1;
            setSelectedAvatar(avatars[index] || avatars[0]);
        }
    }, [store.user]);

    const handleAvatarChange = async (index) => {
        setSelectedAvatar(avatars[index]);

        try {
            await fetch(`${API_URL}/api/user/avatar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + store.token
                },
                body: JSON.stringify({ avatar: index + 1 })
            });

            actions.getCurrentUser();
        } catch (err) {
            console.error("Error actualizando avatar:", err);
        }
    };

    return (
        <div className="profile-container">

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

                <button className="logout-btn" onClick={() => {
                    actions.logout();
                    navigate("/login");
                }}>
                    Log Out
                </button>
            </aside>

            <main className="profile-main">

                <h1 className="shadow-title">SHADOWMAP</h1>

                <div className="profile-card">
                    <img src={selectedAvatar} className="profile-avatar" />

                    <div className="profile-info">
                        <h2>{store.user?.shortname || "Operative"}</h2>
                        <p className="title">Field Investigator</p>

                        <div className="stats">
                            <p><strong>Email:</strong> {store.user?.email}</p>
                            <p><strong>Operative ID:</strong> #{store.user?.id || "0000"}</p>
                            <p><strong>Signal Strength:</strong> 94.2%</p>
                            <p><strong>Entity Classification:</strong> Class IV</p>
                            <p><strong>Places Discovered:</strong> 42</p>
                            <p><strong>Member Since:</strong> {store.user?.created_at || "Unknown"}</p>
                        </div>
                    </div>
                </div>

                <div className="avatar-selector">
                    <h3>Select Your Operative Identity</h3>

                    <div className="avatar-grid">
                        {avatars.map((a, i) => (
                            <img
                                key={i}
                                src={a}
                                className={`avatar-option ${selectedAvatar === a ? "active" : ""}`}
                                onClick={() => handleAvatarChange(i)}
                            />
                        ))}
                    </div>
                </div>

            </main>

        </div>
    );
};

export default Profile;

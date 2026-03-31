import React, { useContext } from "react";
import { Context } from "../store/appContext.jsx";

const Profile = () => {
    const { store } = useContext(Context);

    return (
        <div>
            <h1>Mi Perfil</h1>

            {store.user ? (
                <>
                    <p><strong>Email:</strong> {store.user.email}</p>
                    <p><strong>Nombre:</strong> {store.user.name}</p>
                </>
            ) : (
                <p>No hay usuario cargado.</p>
            )}
        </div>
    );
};

export default Profile;

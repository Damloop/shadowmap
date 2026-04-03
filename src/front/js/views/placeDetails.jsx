import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useParams, useNavigate } from "react-router-dom";

const PlaceDetails = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        actions.loadPlaceById(id);
    }, [id]);

    const place = store.currentPlace;

    if (!place) {
        return (
            <div className="container mt-4">
                <h3>Cargando...</h3>
            </div>
        );
    }

    const handleDelete = async () => {
        if (!confirm("¿Seguro que quieres eliminar este lugar?")) return;

        const success = await actions.deletePlace(id);

        if (success) {
            navigate("/");
        } else {
            alert("Error eliminando el lugar");
        }
    };

    return (
        <div className="container mt-4 text-light">
            <h2>{place.name}</h2>

            <span className={`tag tag-${place.type}`}>{place.type}</span>

            <p className="mt-3">{place.description}</p>

            <div className="mt-3">
                <strong>Lat:</strong> {place.lat}  
                <br />
                <strong>Lng:</strong> {place.lng}
            </div>

            <div className="mt-4">
                <button
                    className="btn btn-warning me-3"
                    onClick={() => navigate(`/edit-place/${id}`)}
                >
                    Editar
                </button>

                <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                >
                    Eliminar
                </button>

                <button
                    className="btn btn-secondary ms-3"
                    onClick={() => navigate("/")}
                >
                    Volver al mapa
                </button>
            </div>
        </div>
    );
};

export default PlaceDetails;

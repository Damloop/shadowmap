import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/placeDetails.css";

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
            <div className="place-details-wrapper">
                <div className="place-details-card">
                    <h3>Cargando...</h3>
                </div>
            </div>
        );
    }

    const handleDelete = async () => {
        if (!confirm("¿Seguro que quieres eliminar este lugar?")) return;

        const success = await actions.deletePlace(id);

        if (success) {
            navigate("/map");
        } else {
            alert("Error eliminando el lugar");
        }
    };

    return (
        <div className="place-details-wrapper">
            <div className="place-details-card">

                <h2>{place.name}</h2>

                <span className={`tag tag-${place.type}`}>{place.type}</span>

                <p className="mt-3">{place.description}</p>

                <div className="place-coords">
                    <strong>Lat:</strong> {place.lat}  
                    <br />
                    <strong>Lng:</strong> {place.lng}
                </div>

                <div className="place-details-buttons">
                    <button
                        className="btn btn-warning"
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
                        className="btn btn-secondary"
                        onClick={() => navigate("/map")}
                    >
                        Volver al mapa
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PlaceDetails;

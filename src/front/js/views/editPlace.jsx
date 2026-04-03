import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, useParams } from "react-router-dom";

const EditPlace = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        lat: "",
        lng: "",
        type: "main",
        description: ""
    });

    // ============================
    // CARGAR DATOS DEL POI
    // ============================
    useEffect(() => {
        actions.loadPlaceById(id);
    }, [id]);

    // Cuando currentPlace llega del store, rellenamos el formulario
    useEffect(() => {
        if (store.currentPlace) {
            setForm({
                name: store.currentPlace.name,
                lat: store.currentPlace.lat,
                lng: store.currentPlace.lng,
                type: store.currentPlace.type,
                description: store.currentPlace.description || ""
            });
        }
    }, [store.currentPlace]);

    // ============================
    // MANEJO DE FORMULARIO
    // ============================
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const success = await actions.updatePlace(id, {
            name: form.name,
            lat: parseFloat(form.lat),
            lng: parseFloat(form.lng),
            type: form.type,
            description: form.description
        });

        if (success) {
            navigate(`/place/${id}`);
        } else {
            alert("Error actualizando el lugar");
        }
    };

    if (!store.currentPlace) {
        return <div className="container mt-4"><h3>Cargando...</h3></div>;
    }

    return (
        <div className="container mt-4">
            <h2>Editar Lugar</h2>

            <form onSubmit={handleSubmit} className="mt-3">

                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Latitud</label>
                        <input
                            type="number"
                            step="0.000001"
                            name="lat"
                            className="form-control"
                            value={form.lat}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Longitud</label>
                        <input
                            type="number"
                            step="0.000001"
                            name="lng"
                            className="form-control"
                            value={form.lng}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Tipo</label>
                    <select
                        name="type"
                        className="form-select"
                        value={form.type}
                        onChange={handleChange}
                    >
                        <option value="main">Principal</option>
                        <option value="social">Social</option>
                        <option value="tech">Tecnológico</option>
                        <option value="exploration">Exploración</option>
                        <option value="neutral">Neutral</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                        name="description"
                        className="form-control"
                        rows="3"
                        value={form.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                    Guardar Cambios
                </button>

                <button
                    type="button"
                    className="btn btn-secondary ms-3"
                    onClick={() => navigate(`/place/${id}`)}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditPlace;

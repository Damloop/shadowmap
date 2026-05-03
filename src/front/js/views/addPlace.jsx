// src/front/js/views/addPlace.jsx

import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const AddPlace = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        lat: "",
        lng: "",
        type: "main",
        description: ""
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const success = await actions.createPlace({
            name: form.name,
            lat: parseFloat(form.lat),
            lng: parseFloat(form.lng),
            type: form.type,
            description: form.description
        });

        if (success) {
            navigate("/");
        } else {
            alert("Error creando el lugar");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Agregar Lugar Embrujado</h2>

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
                    Guardar Lugar
                </button>
            </form>
        </div>
    );
};

export default AddPlace;
import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // ============================
    // FILTRADO + BÚSQUEDA
    // ============================
    const filteredPois = store.pois
        .filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase())
        )
        .filter(p => 
            filter === "all" ? true : p.type === filter
        );

    return (
        <div className="sidebar">

            {/* TÍTULO */}
            <h2>Lugares Embrujados</h2>

            {/* BUSCADOR */}
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {/* FILTROS */}
            <select
                className="form-select mb-3"
                value={filter}
                onChange={e => setFilter(e.target.value)}
            >
                <option value="all">Todos</option>
                <option value="main">Principal</option>
                <option value="social">Social</option>
                <option value="tech">Tecnológico</option>
                <option value="exploration">Exploración</option>
                <option value="neutral">Neutral</option>
            </select>

            {/* LISTA DE LUGARES */}
            {filteredPois.length === 0 && (
                <p className="text-muted">No hay lugares que coincidan.</p>
            )}

            {filteredPois.map(p => (
                <div
                    key={p.id}
                    className="place-card"
                    onClick={() => navigate(`/place/${p.id}`)}
                >
                    <h3>{p.name}</h3>
                    <p>{p.description?.slice(0, 60)}...</p>
                    <span className={`tag tag-${p.type}`}>{p.type}</span>
                </div>
            ))}

        </div>
    );
};

export default Sidebar;

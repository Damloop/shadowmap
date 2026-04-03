import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

<button
    className="btn btn-success"
    onClick={() => navigate("/add-place")}
>
    + Agregar Lugar
</button>

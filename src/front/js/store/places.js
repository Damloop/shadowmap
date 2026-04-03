// src/front/js/store/places.js

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            pois: [],
            currentPlace: null
        },

        actions: {
            // ============================
            // CARGAR TODOS LOS POIS
            // ============================
            loadPois: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/pois");

                    if (!resp.ok) {
                        console.error("Error HTTP cargando POIs:", resp.status);
                        return;
                    }

                    const data = await resp.json();
                    setStore({ pois: data });

                } catch (error) {
                    console.error("Error cargando POIs:", error);
                }
            },

            // ============================
            // CARGAR POI POR ID
            // ============================
            loadPlaceById: async (id) => {
                try {
                    setStore({ currentPlace: null });

                    const resp = await fetch(process.env.BACKEND_URL + "/api/pois/" + id);

                    if (!resp.ok) {
                        console.error("Error HTTP cargando lugar:", resp.status);
                        return;
                    }

                    const data = await resp.json();
                    setStore({ currentPlace: data });

                } catch (error) {
                    console.error("Error cargando lugar:", error);
                }
            },

            // ============================
            // CREAR POI
            // ============================
            createPlace: async (payload) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/pois", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });

                    if (!resp.ok) {
                        console.error("Error creando lugar:", resp.status);
                        return false;
                    }

                    await getActions().loadPois();
                    return true;

                } catch (error) {
                    console.error("Error creando lugar:", error);
                    return false;
                }
            },

            // ============================
            // ACTUALIZAR POI
            // ============================
            updatePlace: async (id, payload) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/pois/" + id, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });

                    if (!resp.ok) {
                        console.error("Error actualizando lugar:", resp.status);
                        return false;
                    }

                    await getActions().loadPois();
                    return true;

                } catch (error) {
                    console.error("Error actualizando lugar:", error);
                    return false;
                }
            },

            // ============================
            // ELIMINAR POI
            // ============================
            deletePlace: async (id) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/pois/" + id, {
                        method: "DELETE"
                    });

                    if (!resp.ok) {
                        console.error("Error eliminando lugar:", resp.status);
                        return false;
                    }

                    await getActions().loadPois();
                    return true;

                } catch (error) {
                    console.error("Error eliminando lugar:", error);
                    return false;
                }
            }
        }
    };
};

export default getState;

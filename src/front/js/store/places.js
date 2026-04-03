// src/front/js/store/places.js

const getState = ({ getStore, getActions, setStore }) => {
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    return {
        store: {
            pois: [],
            currentPlace: null
        },

        actions: {
            loadPois: async () => {
                try {
                    const resp = await fetch(`${API_URL}/api/pois`);
                    if (!resp.ok) return console.error("Error HTTP:", resp.status);

                    const data = await resp.json();
                    setStore({ pois: data });
                } catch (error) {
                    console.error("Error cargando POIs:", error);
                }
            },

            loadPlaceById: async (id) => {
                try {
                    setStore({ currentPlace: null });

                    const resp = await fetch(`${API_URL}/api/pois/${id}`);
                    if (!resp.ok) return console.error("Error HTTP:", resp.status);

                    const data = await resp.json();
                    setStore({ currentPlace: data });
                } catch (error) {
                    console.error("Error cargando lugar:", error);
                }
            },

            createPlace: async (payload) => {
                try {
                    const resp = await fetch(`${API_URL}/api/pois`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });

                    if (!resp.ok) return false;

                    await getActions().loadPois();
                    return true;
                } catch (error) {
                    console.error("Error creando lugar:", error);
                    return false;
                }
            },

            updatePlace: async (id, payload) => {
                try {
                    const resp = await fetch(`${API_URL}/api/pois/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });

                    if (!resp.ok) return false;

                    await getActions().loadPois();
                    return true;
                } catch (error) {
                    console.error("Error actualizando lugar:", error);
                    return false;
                }
            },

            deletePlace: async (id) => {
                try {
                    const resp = await fetch(`${API_URL}/api/pois/${id}`, {
                        method: "DELETE"
                    });

                    if (!resp.ok) return false;

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

// src/front/js/store/flux.js

import places from "./places.js";

const getState = ({ getStore, getActions, setStore }) => {
    const placesState = places({ getStore, getActions, setStore });
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    return {
        store: {
            // POIs
            ...placesState.store,

            // Auth
            token: null,
            user: null,

            // Rutas
            selectedPoints: [],
            markerColor: "blue",
            routes: [],
            savedRoutes: [],
            sharedRoutes: []
        },

        actions: {
            // Acciones de POIs
            ...placesState.actions,

            // ---------------------------
            // AUTH
            // ---------------------------
            syncTokenFromSessionStore: async () => {
                const token = sessionStorage.getItem("token");
                if (!token) return;

                setStore({ ...getStore(), token });
                await getActions().getCurrentUser();
            },

            getCurrentUser: async () => {
                const store = getStore();
                if (!store.token) return;

                try {
                    const resp = await fetch(`${API_URL}/api/auth/me`, {
                        headers: { Authorization: "Bearer " + store.token }
                    });

                    if (!resp.ok) return;

                    const data = await resp.json();
                    setStore({ ...store, user: data });

                } catch (err) {
                    console.error("Error loading user:", err);
                }
            },

            logout: () => {
                sessionStorage.removeItem("token");
                setStore({ ...getStore(), token: null, user: null });
            },

            // ---------------------------
            // RUTAS
            // ---------------------------
            setMarkerColor: color => {
                setStore({ ...getStore(), markerColor: color });
            },

            addPointToRoute: (lat, lng) => {
                const store = getStore();

                if (!Array.isArray(store.selectedPoints)) {
                    setStore({ ...store, selectedPoints: [] });
                    return;
                }

                if (store.selectedPoints.length >= 5) return;

                setStore({
                    ...store,
                    selectedPoints: [...store.selectedPoints, { lat, lng }]
                });
            },

            clearRoutePoints: () => {
                setStore({ ...getStore(), selectedPoints: [] });
            },

            // ---------------------------
            // PUBLICAR RUTA
            // ---------------------------
            publishRoute: async ({ name, rating, notes, points }) => {
                const store = getStore();

                try {
                    const resp = await fetch(`${API_URL}/api/routes`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: store.token ? "Bearer " + store.token : ""
                        },
                        body: JSON.stringify({
                            name,
                            rating: Number(rating),
                            notes,
                            color: store.markerColor,
                            points
                        })
                    });

                    if (!resp.ok) {
                        console.error("Error creando ruta");
                        return;
                    }

                    const data = await resp.json();
                    const newRoute = data.route;

                    const updatedRoutes = [newRoute, ...store.routes];

                    let updatedSaved = [newRoute, ...store.savedRoutes];
                    if (updatedSaved.length > 3) {
                        updatedSaved = updatedSaved.slice(0, 3);
                    }

                    setStore({
                        ...store,
                        routes: updatedRoutes,
                        savedRoutes: updatedSaved,
                        selectedPoints: []
                    });

                } catch (err) {
                    console.error("Error publicando ruta:", err);
                }
            },

            // ---------------------------
            // CARGAR RUTAS GUARDADAS
            // ---------------------------
            loadRoutes: async () => {
                const store = getStore();

                try {
                    const resp = await fetch(`${API_URL}/api/routes`, {
                        headers: {
                            Authorization: store.token ? "Bearer " + store.token : ""
                        }
                    });

                    if (!resp.ok) return;

                    const data = await resp.json();

                    setStore({
                        ...store,
                        routes: data,
                        savedRoutes: data.slice(0, 3)
                    });

                } catch (err) {
                    console.error("Error cargando rutas:", err);
                }
            },

            // ---------------------------
            // CARGAR RUTAS COMPARTIDAS
            // ---------------------------
            loadSharedRoutes: async () => {
                try {
                    const resp = await fetch(`${API_URL}/api/routes/shared`);
                    if (!resp.ok) return;

                    const data = await resp.json();

                    setStore({
                        ...getStore(),
                        sharedRoutes: data.slice(0, 3)
                    });

                } catch (err) {
                    console.error("Error cargando rutas compartidas:", err);
                }
            },

            // ---------------------------
            // COMPARTIR RUTA
            // ---------------------------
            shareRoute: async routeId => {
                const store = getStore();

                try {
                    const resp = await fetch(`${API_URL}/api/routes/${routeId}/share`, {
                        method: "POST",
                        headers: {
                            Authorization: store.token ? "Bearer " + store.token : ""
                        }
                    });

                    if (!resp.ok) return;

                    const data = await resp.json();
                    const shared = data.route;

                    let updatedShared = [shared, ...store.sharedRoutes];
                    if (updatedShared.length > 3) {
                        updatedShared = updatedShared.slice(0, 3);
                    }

                    setStore({
                        ...store,
                        sharedRoutes: updatedShared
                    });

                } catch (err) {
                    console.error("Error compartiendo ruta:", err);
                }
            }
        }
    };
};

export default getState;

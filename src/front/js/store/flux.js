// src/front/js/store/flux.js

import places from "./places.js";
import { API_URL } from "../../api/config.js";   // ← IMPORTANTE

const getState = ({ getStore, getActions, setStore }) => {

    const placesState = places({ getStore, getActions, setStore, API_URL });

    return {
        store: {
            ...placesState.store,

            token: null,
            user: null,

            selectedPoints: [],
            markerColor: "blue",
            routes: [],
            savedRoutes: [],
            sharedRoutes: []
        },

        actions: {
            ...placesState.actions,

            // ---------------------------
            // REGISTER
            // ---------------------------
            register: async (email, password, username, avatar) => {
                try {
                    const resp = await fetch(`${API_URL}/api/register`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email,
                            password,
                            username,
                            avatar
                        })
                    });

                    if (!resp.ok) {
                        const error = await resp.json().catch(() => null);
                        return {
                            success: false,
                            message: error?.msg || "No se pudo crear el usuario"
                        };
                    }

                    const data = await resp.json();

                    return {
                        success: true,
                        message: data.msg || "Especialista tenebroso creado"
                    };

                } catch (err) {
                    console.error("Error en registro:", err);
                    return { success: false, message: "Error de servidor" };
                }
            },

            // ---------------------------
            // LOGIN
            // ---------------------------
            login: async (email, password) => {
                try {
                    const resp = await fetch(`${API_URL}/api/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password })
                    });

                    if (!resp.ok) {
                        return { success: false, message: "Credenciales incorrectas" };
                    }

                    const data = await resp.json();

                    sessionStorage.setItem("token", data.token);

                    setStore({
                        ...getStore(),
                        token: data.token,
                        user: data.user
                    });

                    return { success: true };

                } catch (err) {
                    console.error("Error en login:", err);
                    return { success: false, message: "Error de servidor" };
                }
            },

            // ---------------------------
            // GET CURRENT USER
            // ---------------------------
            getCurrentUser: async () => {
                const store = getStore();
                if (!store.token) return;

                try {
                    const resp = await fetch(`${API_URL}/api/auth/me`, {
                        headers: { Authorization: "Bearer " + store.token }
                    });

                    if (!resp.ok) return;

                    const data = await resp.json();

                    setStore({
                        ...store,
                        user: data
                    });

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

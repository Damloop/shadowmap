import places from "./places.js";
import { API_URL } from "../../api/config.js";

const getState = ({ getStore, getActions, setStore }) => {

    const placesState = places({ getStore, getActions, setStore, API_URL });

    return {
        store: {
            ...placesState.store,

            token: null,
            user: null,
            userLocation: null,

            selectedPoints: [],
            markerColor: "blue",

            routes: [],
            savedRoutes: [],
            sharedRoutes: []
        },

        actions: {
            ...placesState.actions,

            syncTokenFromSessionStore: () => {
                const token = localStorage.getItem("token");
                const user = localStorage.getItem("user");

                if (token) setStore({ token });
                if (user) setStore({ user: JSON.parse(user) });
            },

            getUserLocation: () => {
                if (!navigator.geolocation) return;

                navigator.geolocation.getCurrentPosition(
                    pos => {
                        setStore({
                            userLocation: {
                                lat: pos.coords.latitude,
                                lng: pos.coords.longitude
                            }
                        });
                    },
                    () => {}
                );
            },

            recover: async (email) => {
                try {
                    const resp = await fetch(`${API_URL}/api/recover`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email })
                    });

                    if (!resp.ok) return { success: false };
                    return { success: true };

                } catch (err) {
                    return { success: false };
                }
            },

            register: async (email, password, shortname, avatar) => {
                try {
                    const resp = await fetch(`${API_URL}/api/register`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email,
                            password,
                            shortname,
                            avatar
                        })
                    });

                    const data = await resp.json();

                    if (!resp.ok) {
                        return {
                            success: false,
                            message: data?.msg || "No se pudo crear el usuario"
                        };
                    }

                    return {
                        success: true,
                        message: data.msg || "Usuario creado"
                    };

                } catch (err) {
                    return { success: false, message: "Error de servidor" };
                }
            },

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

                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));

                    setStore({
                        token: data.token,
                        user: {
                            ...data.user,
                            avatar: Number(data.user.avatar) || 1
                        }
                    });

                    return { success: true };

                } catch (err) {
                    return { success: false, message: "Error de servidor" };
                }
            },

            logout: () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setStore({ token: null, user: null });
            },

            getCurrentUser: async () => {
                const store = getStore();
                if (!store.token) return;

                try {
                    const resp = await fetch(`${API_URL}/api/current-user`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + store.token
                        }
                    });

                    if (!resp.ok) return;

                    const data = await resp.json();

                    setStore({
                        ...store,
                        user: {
                            ...data.user,
                            avatar: Number(data.user.avatar) || 1,
                            is_premium: data.user.is_premium || false
                        }
                    });

                } catch (err) {}
            },

            publishRoute: async (routeData) => {
                const store = getStore();
                if (!store.token) return;

                try {
                    const resp = await fetch(`${API_URL}/api/routes`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + store.token
                        },
                        body: JSON.stringify(routeData)
                    });

                    if (!resp.ok) return;

                    getActions().loadSavedRoutes();

                } catch (err) {}
            },

            loadSavedRoutes: async () => {
                const store = getStore();
                if (!store.token) return;

                try {
                    const resp = await fetch(`${API_URL}/api/saved-routes`, {
                        headers: {
                            Authorization: "Bearer " + store.token
                        }
                    });

                    const data = await resp.json();
                    setStore({ savedRoutes: data });

                } catch (err) {}
            },

            loadSharedRoutes: async () => {
                const store = getStore();
                if (!store.token) return;

                try {
                    const resp = await fetch(`${API_URL}/api/shared-routes`, {
                        headers: {
                            Authorization: "Bearer " + store.token
                        }
                    });

                    const data = await resp.json();
                    setStore({ sharedRoutes: data });

                } catch (err) {}
            }
        }
    };
};

export default getState;

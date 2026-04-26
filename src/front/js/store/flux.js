// src/front/js/store/flux.js

import places from "./places.js";
import { API_URL } from "../../api/config.js";

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

            syncTokenFromSessionStore: () => {
                const token = sessionStorage.getItem("token");
                if (!token) return;

                setStore({
                    ...getStore(),
                    token
                });

                getActions().getCurrentUser();
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

                    sessionStorage.setItem("token", data.token);

                    setStore({
                        ...getStore(),
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

            // ======================================================
            // PREMIUM — ACTIVAR PREMIUM
            // ======================================================
            activatePremium: async () => {
                const store = getStore();
                if (!store.token) return { success: false };

                try {
                    const resp = await fetch(`${API_URL}/api/premium`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + store.token
                        }
                    });

                    const data = await resp.json();

                    if (!resp.ok) return { success: false, message: data.msg };

                    // refrescar usuario
                    await getActions().getCurrentUser();

                    return { success: true };

                } catch (err) {
                    return { success: false, message: "Error de servidor" };
                }
            },

            // ======================================================
            // GET CURRENT USER
            // ======================================================
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

            logout: () => {
                sessionStorage.removeItem("token");
                setStore({ ...getStore(), token: null, user: null });
            }
        }
    };
};

export default getState;

// src/front/js/store/flux.js

import places from "./places.js";
import { API_URL } from "../../api/config.js";

const getState = ({ getStore, getActions, setStore }) => {
  const placesState = places({ getStore, getActions, setStore, API_URL });

  return {
    store: {
      ...placesState.store,

      token: localStorage.getItem("token") || null,
      user: (() => {
        try {
          return JSON.parse(localStorage.getItem("user")) || null;
        } catch (err) {
          return null;
        }
      })(),
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
        try {
          const token = localStorage.getItem("token");
          const userRaw = localStorage.getItem("user");

          if (token) setStore({ token });
          if (userRaw) {
            try {
              setStore({ user: JSON.parse(userRaw) });
            } catch (err) {
              localStorage.removeItem("user");
              setStore({ user: null });
            }
          }
        } catch (err) {}
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
          console.error("recover error:", err);
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
          console.error("register error:", err);
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

          const data = await resp.json();

          if (!resp.ok) {
            return {
              success: false,
              message: data?.msg || "Credenciales incorrectas"
            };
          }

          try {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
          } catch (err) {
            console.warn("localStorage set failed:", err);
          }

          setStore({
            token: data.token,
            user: {
              ...data.user,
              avatar: Number(data.user?.avatar) || 1
            }
          });

          return { success: true };
        } catch (err) {
          console.error("login error:", err);
          return { success: false, message: "Error de servidor" };
        }
      },

      logout: () => {
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } catch (err) {}
        setStore({ token: null, user: null });
      },

      publishRoute: async (routeData) => {
        const store = getStore();
        if (!store?.token) return;

        try {
          const resp = await fetch(`${API_URL}/api/routes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + store.token
            },
            body: JSON.stringify(routeData)
          });

          if (!resp.ok) {
            console.warn("publishRoute failed", resp.status);
            return;
          }

          if (getActions()?.loadSavedRoutes) getActions().loadSavedRoutes();
        } catch (err) {
          console.error("publishRoute error:", err);
        }
      },

      loadSavedRoutes: async () => {
        const store = getStore();
        if (!store?.token) return;

        try {
          const resp = await fetch(`${API_URL}/api/saved-routes`, {
            headers: {
              Authorization: "Bearer " + store.token
            }
          });

          if (!resp.ok) {
            console.warn("loadSavedRoutes failed", resp.status);
            return;
          }

          const data = await resp.json();
          setStore({ savedRoutes: data });
        } catch (err) {
          console.error("loadSavedRoutes error:", err);
        }
      },

      loadSharedRoutes: async () => {
        const store = getStore();
        if (!store?.token) return;

        try {
          const resp = await fetch(`${API_URL}/api/routes/shared`, {
            headers: {
              Authorization: "Bearer " + store.token
            }
          });

          if (!resp.ok) {
            console.warn("loadSharedRoutes failed", resp.status);
            return;
          }

          const data = await resp.json();
          setStore({ sharedRoutes: data });
        } catch (err) {
          console.error("loadSharedRoutes error:", err);
        }
      },

      /* ---------------------------
         Local saved routes helpers
      ---------------------------*/
      saveRouteLocal: (route) => {
        try {
          const raw = localStorage.getItem("savedRoutes_local");
          const arr = raw ? JSON.parse(raw) : [];
          const toSave = {
            id: Date.now().toString(),
            name: route.name || "Ruta sin nombre",
            description: route.description || "",
            characteristics: route.characteristics || "",
            points: route.points || [],
            createdAt: new Date().toISOString()
          };
          arr.push(toSave);
          localStorage.setItem("savedRoutes_local", JSON.stringify(arr));
          setStore({ savedRoutes: arr });
        } catch (err) {
          console.error("saveRouteLocal error:", err);
        }
      },

      loadSavedRoutesLocal: () => {
        try {
          const raw = localStorage.getItem("savedRoutes_local");
          const arr = raw ? JSON.parse(raw) : [];
          setStore({ savedRoutes: arr });
        } catch (err) {
          console.error("loadSavedRoutesLocal error:", err);
          setStore({ savedRoutes: [] });
        }
      },

      deleteSavedRouteLocal: (id) => {
        try {
          const raw = localStorage.getItem("savedRoutes_local");
          const arr = raw ? JSON.parse(raw) : [];
          const filtered = arr.filter(r => r.id !== id);
          localStorage.setItem("savedRoutes_local", JSON.stringify(filtered));
          setStore({ savedRoutes: filtered });
        } catch (err) {
          console.error("deleteSavedRouteLocal error:", err);
        }
      },

      /* ---------------------------
         Rutas en curso (crear/editar/publicar)
      ---------------------------*/
      startNewRoute: (initialName = "Ruta sin nombre") => {
        try {
          setStore({
            selectedPoints: [],
            currentRouteMeta: { name: initialName, description: "", characteristics: "" }
          });
        } catch (err) {}
      },

      addPointToRoute: (lat, lng) => {
        try {
          const store = getStore();
          const points = Array.isArray(store.selectedPoints) ? [...store.selectedPoints] : [];
          points.push({ lat, lng, createdAt: new Date().toISOString() });
          setStore({ selectedPoints: points });
        } catch (err) {}
      },

      clearSelectedPoints: () => {
        try {
          setStore({ selectedPoints: [], currentRouteMeta: null });
        } catch (err) {}
      },

      saveRouteLocalFromSelected: (meta = {}) => {
        try {
          const store = getStore();
          const raw = localStorage.getItem("savedRoutes_local");
          const arr = raw ? JSON.parse(raw) : [];
          const toSave = {
            id: Date.now().toString(),
            name: meta.name || (store.currentRouteMeta && store.currentRouteMeta.name) || "Ruta sin nombre",
            description: meta.description || (store.currentRouteMeta && store.currentRouteMeta.description) || "",
            characteristics: meta.characteristics || (store.currentRouteMeta && store.currentRouteMeta.characteristics) || "",
            points: store.selectedPoints || [],
            createdAt: new Date().toISOString()
          };
          arr.push(toSave);
          localStorage.setItem("savedRoutes_local", JSON.stringify(arr));
          setStore({ savedRoutes: arr, selectedPoints: [], currentRouteMeta: null });
          return { success: true, saved: toSave };
        } catch (err) {
          console.error("saveRouteLocalFromSelected error:", err);
          return { success: false, message: "Error guardando localmente" };
        }
      },

      publishRouteFromSelected: async (meta = {}) => {
        try {
          const store = getStore();
          const routePayload = {
            name: meta.name || (store.currentRouteMeta && store.currentRouteMeta.name) || "Ruta sin nombre",
            description: meta.description || (store.currentRouteMeta && store.currentRouteMeta.description) || "",
            characteristics: meta.characteristics || (store.currentRouteMeta && store.currentRouteMeta.characteristics) || "",
            points: store.selectedPoints || []
          };

          if (!store?.token) {
            return getActions().saveRouteLocalFromSelected(meta);
          }

          const resp = await fetch(`${API_URL}/api/routes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + store.token
            },
            body: JSON.stringify(routePayload)
          });

          if (!resp.ok) {
            return getActions().saveRouteLocalFromSelected(meta);
          }

          if (getActions()?.loadSavedRoutes) getActions().loadSavedRoutes();

          setStore({ selectedPoints: [], currentRouteMeta: null });

          return { success: true };
        } catch (err) {
          console.error("publishRouteFromSelected error:", err);
          return getActions().saveRouteLocalFromSelected(meta);
        }
      }
    }
  };
};

export default getState;

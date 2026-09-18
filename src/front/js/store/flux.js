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
        } catch {
          return null;
        }
      })(),

      userLocation: null,

      selectedPoints: [],
      markerColor: "blue",

      routes: [],
      savedRoutes: [],
      sharedRoutes: [],

      activeMission: null,
      missionPoint: null,

      showPremiumPopup: false,
    },

    actions: {
      ...placesState.actions,

      // ============================================================
      // LOGIN
      // ============================================================
      login: async (email, password) => {
        try {
          const resp = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await resp.json();

          if (!resp.ok || !data.token) {
            return {
              success: false,
              message: data.msg || "Credenciales incorrectas",
            };
          }

          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          setStore({
            token: data.token,
            user: data.user,
          });

          // Reset de estado local
          localStorage.removeItem("shadowmap_completed_missions");
          localStorage.removeItem("savedRoutes_local");

          setStore({
            activeMission: null,
            missionPoint: null,
            selectedPoints: [],
            savedRoutes: [],
            showPremiumPopup: false,
          });

          return { success: true };
        } catch {
          return {
            success: false,
            message: "Error de conexión con el servidor",
          };
        }
      },

      // ============================================================
      // SIGNUP
      // ============================================================
      signup: async (email, password) => {
        try {
          const resp = await fetch(`${API_URL}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await resp.json();

          if (!resp.ok || !data.token) {
            return {
              success: false,
              message: data.msg || "No se pudo registrar",
            };
          }

          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          setStore({
            token: data.token,
            user: data.user,
          });

          return { success: true };
        } catch {
          return {
            success: false,
            message: "Error de conexión con el servidor",
          };
        }
      },

      // ============================================================
      // LOGOUT
      // ============================================================
      logout: () => {
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("shadowmap_completed_missions");
          localStorage.removeItem("savedRoutes_local");
        } catch {}

        setStore({
          token: null,
          user: null,
          activeMission: null,
          missionPoint: null,
          selectedPoints: [],
          savedRoutes: [],
          showPremiumPopup: false,
        });
      },

      // ============================================================
      // SYNC TOKEN
      // ============================================================
      syncTokenFromSessionStore: () => {
        try {
          const token = localStorage.getItem("token");
          const userRaw = localStorage.getItem("user");

          if (token) setStore({ token });

          if (userRaw) {
            try {
              setStore({ user: JSON.parse(userRaw) });
            } catch {
              localStorage.removeItem("user");
              setStore({ user: null });
            }
          }
        } catch {}
      },

      // ============================================================
      // USER LOCATION
      // ============================================================
      getUserLocation: () => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setStore({
              userLocation: {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              },
            });
          },
          () => {},
        );
      },

      // ============================================================
      // PREMIUM
      // ============================================================
      activatePremium: async () => {
        const store = getStore();
        const token = store.token;

        if (!token) {
          return { success: false, message: "No hay token" };
        }

        try {
          const resp = await fetch(`${API_URL}/api/premium`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          });

          const data = await resp.json();

          if (!resp.ok) {
            return {
              success: false,
              message: data.msg || "No se pudo activar Premium",
            };
          }

          const updatedUser = {
            ...store.user,
            is_premium: true,
          };

          setStore({ user: updatedUser });
          localStorage.setItem("user", JSON.stringify(updatedUser));

          return { success: true };
        } catch {
          return { success: false, message: "Error de conexión" };
        }
      },

      // ============================================================
      // PLACES CRUD
      // ============================================================
      createPlace: async (placeData) => {
        const store = getStore();
        const token = store.token;

        try {
          const resp = await fetch(`${API_URL}/api/places`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify(placeData),
          });

          const data = await resp.json();

          if (!resp.ok) {
            return {
              success: false,
              message: data.message || "Error creando el lugar",
            };
          }

          return { success: true, place: data.place };
        } catch {
          return { success: false, message: "Error de conexión" };
        }
      },

      updatePlace: async (id, placeData) => {
        const store = getStore();
        const token = store.token;

        try {
          const resp = await fetch(`${API_URL}/api/places/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify(placeData),
          });

          const data = await resp.json();

          if (!resp.ok) {
            return {
              success: false,
              message: data.message || "Error actualizando el lugar",
            };
          }

          return { success: true, place: data.place };
        } catch {
          return { success: false, message: "Error de conexión" };
        }
      },

      // ============================================================
      // POIS — GET ALL
      // ============================================================
      getPois: async () => {
        try {
          const store = getStore();
          const token = store.token || localStorage.getItem("token");

          const resp = await fetch(`${API_URL}/api/pois`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          const data = await resp.json();

          if (!resp.ok) {
            console.error("Error cargando POIs:", data);
            return [];
          }

          setStore({ pois: data });
          return data;
        } catch (err) {
          console.error("Error en getPois:", err);
          return [];
        }
      },

      // ============================================================
      // POIS — GET ONE
      // ============================================================
      getPoi: async (id) => {
        try {
          const store = getStore();
          const token = store.token || localStorage.getItem("token");

          const resp = await fetch(`${API_URL}/api/pois/${id}`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          const data = await resp.json();

          if (!resp.ok) {
            console.error("Error cargando POI:", data);
            return null;
          }

          setStore({ currentPoi: data });
          return data;
        } catch (err) {
          console.error("Error en getPoi:", err);
          return null;
        }
      },

      // ============================================================
      // ROUTES — PREMIUM ROUTES (GET ALL)
      // ============================================================
      getPremiumRoutes: async () => {
        try {
          const store = getStore();
          const token = store.token;

          const resp = await fetch(`${API_URL}/api/premium-routes`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          const data = await resp.json();

          if (!resp.ok) {
            console.error("Error cargando rutas premium:", data);
            return [];
          }

          setStore({ routes: data.routes || [] });
          return data.routes || [];
        } catch (err) {
          console.error("Error en getPremiumRoutes:", err);
          return [];
        }
      },

      // ============================================================
      // ROUTES — GET ONE
      // ============================================================
      getRoute: async (id) => {
        try {
          const store = getStore();
          const token = store.token;

          const resp = await fetch(`${API_URL}/api/premium-routes/${id}`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          const data = await resp.json();

          if (!resp.ok) {
            console.error("Error cargando ruta:", data);
            return null;
          }

          setStore({ currentRoute: data.route });
          return data.route;
        } catch (err) {
          console.error("Error en getRoute:", err);
          return null;
        }
      },

      // ============================================================
      // ROUTES — SHARE ROUTE
      // ============================================================
      shareRoute: async (routeId, targetEmail) => {
        try {
          const store = getStore();
          const token = store.token;

          const resp = await fetch(`${API_URL}/api/routes/share`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ route_id: routeId, email: targetEmail }),
          });

          const data = await resp.json();

          if (!resp.ok) {
            return {
              success: false,
              message: data.message || "Error compartiendo la ruta",
            };
          }

          return { success: true };
        } catch {
          return { success: false, message: "Error de conexión" };
        }
      },

      // ============================================================
      // GET USER PROFILE (ya corregido)
      // ============================================================
      getMe: async () => {
        try {
          const store = getStore();
          const token = store.token || localStorage.getItem("token");

          if (!token) return null;

          const resp = await fetch(`${API_URL}/api/auth/me`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          const data = await resp.json();

          if (!resp.ok || !data.user) {
            return null;
          }

          setStore({ user: data.user });
          localStorage.setItem("user", JSON.stringify(data.user));

          return data.user;
        } catch (err) {
          console.error("Error en getMe:", err);
          return null;
        }
      },

      // ============================================================
      // MISSIONS
      // ============================================================
      setActiveMission: (mission) => {
        setStore({ activeMission: mission });
      },

      generateMissionPoint: (coords) => {
        const store = getStore();

        let lat, lng;

        if (Array.isArray(coords) && coords.length === 2) {
          [lat, lng] = coords;
        } else if (store.userLocation) {
          lat = store.userLocation.lat;
          lng = store.userLocation.lng;
        } else {
          return;
        }

        const point = {
          lat: lat + (Math.random() - 0.5) * 0.002,
          lng: lng + (Math.random() - 0.5) * 0.002,
        };

        setStore({ missionPoint: point });
        return point;
      },

      completeMission: (missionId) => {
        try {
          const KEY = "shadowmap_completed_missions";
          const raw = localStorage.getItem(KEY);
          const completed = raw ? JSON.parse(raw) : [];

          let updatedCompleted = completed;

          if (!completed.includes(missionId)) {
            updatedCompleted = [...completed, missionId];
            localStorage.setItem(KEY, JSON.stringify(updatedCompleted));
          }

          alert("Misión completada");

          const store = getStore();
          const totalMissions = store.missions?.length || 0;
          const completedNow = updatedCompleted.length;

          if (totalMissions > 0 && completedNow >= totalMissions) {
            setStore({ showPremiumPopup: true });
          }
        } catch {}

        setStore({
          activeMission: null,
          missionPoint: null,
        });
      },
    },
  };
};

export default getState;

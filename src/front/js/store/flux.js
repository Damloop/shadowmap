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
      missionPoint: null
    },

    actions: {
      ...placesState.actions,

      /* ---------------------------
         LOGIN — RESETEA TODO
      ---------------------------*/
      login: async (email, password) => {
        try {
          const resp = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });

          const data = await resp.json();

          if (!resp.ok) {
            return { success: false, message: data.msg || "Credenciales incorrectas" };
          }

          // Guardar sesión
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Guardar en store
          setStore({
            token: data.token,
            user: data.user
          });

          // 🔥 RESETEAR MISIONES Y RUTAS AL CAMBIAR DE USUARIO
          localStorage.removeItem("shadowmap_completed_missions");
          localStorage.removeItem("savedRoutes_local");

          setStore({
            activeMission: null,
            missionPoint: null,
            selectedPoints: [],
            savedRoutes: []
          });

          return { success: true };
        } catch {
          return { success: false, message: "Error de conexión con el servidor" };
        }
      },

      /* ---------------------------
         LOGOUT — LIMPIA TODO
      ---------------------------*/
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
          savedRoutes: []
        });
      },

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

      /* ---------------------------
         UBICACIÓN
      ---------------------------*/
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

      /* ---------------------------
         RUTAS LOCALES
      ---------------------------*/
      saveRouteLocal: (route) => {
        try {
          const raw = localStorage.getItem("savedRoutes_local");
          const arr = raw ? JSON.parse(raw) : [];

          const toSave = {
            id: Date.now().toString(),
            name: route.name || "Ruta sin nombre",
            description: route.description || "",
            rating: Number(route.rating) || 1,
            points: route.points || [],
            createdAt: new Date().toISOString()
          };

          arr.push(toSave);

          localStorage.setItem("savedRoutes_local", JSON.stringify(arr));
          setStore({ savedRoutes: arr });
        } catch {}
      },

      loadSavedRoutesLocal: () => {
        try {
          const raw = localStorage.getItem("savedRoutes_local");
          let arr = raw ? JSON.parse(raw) : [];

          arr = arr.map(r => ({
            ...r,
            rating: Number(r.rating) || 1,
            createdAt: r.createdAt || new Date().toISOString()
          }));

          setStore({ savedRoutes: arr });
        } catch {
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
        } catch {}
      },

      addPointToRoute: (lat, lng) => {
        const store = getStore();
        const points = Array.isArray(store.selectedPoints) ? [...store.selectedPoints] : [];
        points.push({ lat, lng, createdAt: new Date().toISOString() });
        setStore({ selectedPoints: points });
      },

      clearSelectedPoints: () => {
        setStore({ selectedPoints: [], currentRouteMeta: null });
      },

      /* ---------------------------
         MISIONES
      ---------------------------*/
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
          lng: lng + (Math.random() - 0.5) * 0.002
        };

        setStore({ missionPoint: point });
        return point;
      },

      completeMission: (missionId) => {
        try {
          const KEY = "shadowmap_completed_missions";
          const raw = localStorage.getItem(KEY);
          const completed = raw ? JSON.parse(raw) : [];

          if (!completed.includes(missionId)) {
            localStorage.setItem(KEY, JSON.stringify([...completed, missionId]));
          }
        } catch {}

        setStore({
          activeMission: null,
          missionPoint: null
        });
      }
    }
  };
};

export default getState;

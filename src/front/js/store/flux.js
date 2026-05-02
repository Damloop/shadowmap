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
      savedRoutes: [],

      activeMission: null,
      missionPoint: null,

      allMissionsCompleted: false
    },

    actions: {
      ...placesState.actions,

      resetAllForNewUser: () => {
        localStorage.removeItem("shadowmap_completed_missions");
        localStorage.removeItem("savedRoutes_local");

        setStore({
          selectedPoints: [],
          savedRoutes: [],
          activeMission: null,
          missionPoint: null,
          userLocation: null,
          allMissionsCompleted: false
        });
      },

      login: async (email, password) => {
        try {
          const resp = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });

          if (!resp.ok)
            return { success: false, message: "Credenciales incorrectas." };

          const data = await resp.json();
          if (!data.token)
            return { success: false, message: "Token no recibido." };

          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          const lastUser = localStorage.getItem("last_user_email");

          if (lastUser !== data.user.email) {
            getActions().resetAllForNewUser();
          }

          localStorage.setItem("last_user_email", data.user.email);

          setStore({
            token: data.token,
            user: data.user
          });

          return { success: true };
        } catch {
          return {
            success: false,
            message: "Error de conexión con el servidor."
          };
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setStore({ token: null, user: null });
      },

      syncToken: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          setStore({ token: null, user: null });
          return;
        }

        try {
          const resp = await fetch(`${API_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!resp.ok) {
            setStore({
              token,
              user: JSON.parse(localStorage.getItem("user")) || {}
            });
            return;
          }

          const data = await resp.json();

          localStorage.setItem("user", JSON.stringify(data.user));

          setStore({
            token,
            user: data.user
          });
        } catch {
          setStore({
            token,
            user: JSON.parse(localStorage.getItem("user")) || {}
          });
        }
      },

      saveRouteLocal: (route) => {
        try {
          const raw = localStorage.getItem("savedRoutes_local");
          const arr = raw ? JSON.parse(raw) : [];

          if (arr.length >= 3) {
            alert("Máximo 3 rutas guardadas.");
            return;
          }

          const colors = ["#ff4444", "#44ff44", "#4488ff"];
          const index = arr.length % colors.length;

          const newRoute = { ...route, color: colors[index] };

          const updated = [...arr, newRoute];

          localStorage.setItem("savedRoutes_local", JSON.stringify(updated));
          setStore({ savedRoutes: updated });
        } catch {}
      },

      loadSavedRoutesLocal: () => {
        try {
          const raw = localStorage.getItem("savedRoutes_local");
          const arr = raw ? JSON.parse(raw) : [];
          setStore({ savedRoutes: arr });
        } catch {
          setStore({ savedRoutes: [] });
        }
      },

      deleteRoute: (id) => {
        const store = getStore();
        const updated = store.savedRoutes.filter((r) => r.id !== id);

        localStorage.setItem("savedRoutes_local", JSON.stringify(updated));
        setStore({ savedRoutes: updated });
      },

      editRoute: (id, newData) => {
        const store = getStore();
        const updated = store.savedRoutes.map((r) =>
          r.id === id ? { ...r, ...newData } : r
        );

        localStorage.setItem("savedRoutes_local", JSON.stringify(updated));
        setStore({ savedRoutes: updated });
      },

      loadRouteToEditor: (id) => {
        const store = getStore();
        const route = store.savedRoutes.find((r) => r.id === id);
        if (!route) return;

        setStore({
          selectedPoints: route.points
        });
      },

      shareRoute: () => {
        alert("Compartir ruta estará disponible próximamente.");
      },

      addPointToRoute: (lat, lng) => {
        const store = getStore();
        const points = [...store.selectedPoints];
        points.push({ lat, lng, createdAt: new Date().toISOString() });
        setStore({ selectedPoints: points });
      },

      clearSelectedPoints: () => {
        setStore({ selectedPoints: [] });
      },

      setActiveMission: (mission) => {
        setStore({ activeMission: mission });
      },

      generateMissionPoint: ([lat, lng]) => {
        const point = {
          lat: lat + (Math.random() - 0.5) * 0.002,
          lng: lng + (Math.random() - 0.5) * 0.002
        };

        setStore({ missionPoint: point });
        return point;
      },

      checkAllMissionsCompleted: () => {
        const KEY = "shadowmap_completed_missions";
        const raw = localStorage.getItem(KEY);
        const completed = raw ? JSON.parse(raw) : [];

        const TOTAL = 5;

        if (completed.length >= TOTAL) {
          setStore({ allMissionsCompleted: true });
        }
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

        getActions().checkAllMissionsCompleted();

        return {
          success: true,
          message:
            "Has completado la misión. Ya no podrás volver a acceder a ella y aparecerá en gris en tu perfil."
        };
      }
    }
  };
};

export default getState;

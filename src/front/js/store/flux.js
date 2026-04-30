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
      savedRoutes: [],

      activeMission: null,
      missionPoint: null
    },

    actions: {
      ...placesState.actions,

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
        const updated = store.savedRoutes.filter(r => r.id !== id);

        localStorage.setItem("savedRoutes_local", JSON.stringify(updated));
        setStore({ savedRoutes: updated });
      },

      editRoute: (id, newData) => {
        const store = getStore();
        const updated = store.savedRoutes.map(r =>
          r.id === id ? { ...r, ...newData } : r
        );

        localStorage.setItem("savedRoutes_local", JSON.stringify(updated));
        setStore({ savedRoutes: updated });
      },

      shareRoute: (id) => {
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

import places from "./places.js";

const getState = ({ getStore, getActions, setStore }) => {
  const placesState = places({ getStore, getActions, setStore });
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  return {
    store: {
      // de places.js
      ...placesState.store,

      // auth
      token: null,
      user: null,

      // rutas
      selectedPoints: [],
      markerColor: "blue",
      routes: [],
      savedRoutes: [],
      sharedRoutes: []
    },

    actions: {
      // acciones de places (POIs)
      ...placesState.actions,

      // ---------- AUTH ----------
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
          setStore({ ...getStore(), user: data });
        } catch (err) {
          console.error("Error loading user:", err);
        }
      },

      logout: () => {
        sessionStorage.removeItem("token");
        setStore({ ...getStore(), token: null, user: null });
      },

      // ---------- RUTAS ----------
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

      publishRoute: ({ name, rating, notes, points }) => {
        const store = getStore();

        const newRoute = {
          id: Date.now(),
          name,
          rating: Number(rating),
          notes,
          points,
          color: store.markerColor,
          createdAt: new Date().toISOString()
        };

        const updatedRoutes = [...store.routes, newRoute];

        let updatedSaved = [...store.savedRoutes, newRoute];
        if (updatedSaved.length > 3) {
          updatedSaved = updatedSaved.slice(updatedSaved.length - 3);
        }

        setStore({
          ...store,
          routes: updatedRoutes,
          savedRoutes: updatedSaved,
          selectedPoints: []
        });
      },

      loadSharedRoutes: () => {
        const store = getStore();
        if (!Array.isArray(store.sharedRoutes)) {
          setStore({ ...store, sharedRoutes: [] });
        }
      },

      shareRoute: routeId => {
        const store = getStore();
        const route = store.routes.find(r => r.id === routeId);
        if (!route) return;

        let updatedShared = [...store.sharedRoutes, route];
        if (updatedShared.length > 3) {
          updatedShared = updatedShared.slice(updatedShared.length - 3);
        }

        setStore({
          ...store,
          sharedRoutes: updatedShared
        });
      }
    }
  };
};

export default getState;

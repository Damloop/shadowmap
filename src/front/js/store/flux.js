import places from "./places.js";

const getState = ({ getStore, getActions, setStore }) => {
  const placesState = places({ getStore, getActions, setStore });

  const API_URL = import.meta.env.VITE_BACKEND_URL; // 🔥 CORRECTO PARA VITE

  return {
    store: {
      ...placesState.store,
      token: null,
      user: null,
    },

    actions: {
      ...placesState.actions,

      // ============================
      // REGISTRO
      // ============================
      register: async ({ name, email, password }) => {
        try {
          const resp = await fetch(`${API_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });

          if (!resp.ok) {
            console.error("Error en registro:", resp.status);
            return false;
          }

          return true;
        } catch (error) {
          console.error("Error en register:", error);
          return false;
        }
      },

      // ============================
      // LOGIN
      // ============================
      login: async (email, password) => {
        try {
          const resp = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!resp.ok) {
            console.error("Error en login:", resp.status);
            return false;
          }

          const data = await resp.json();

          sessionStorage.setItem("token", data.token);
          setStore({ token: data.token });

          const actions = getActions();
          await actions.getCurrentUser();

          return true;
        } catch (error) {
          console.error("Error en login:", error);
          return false;
        }
      },

      // ============================
      // CARGAR USUARIO AUTENTICADO
      // ============================
      getCurrentUser: async () => {
        const store = getStore();
        if (!store.token) return;

        try {
          const resp = await fetch(`${API_URL}/api/auth/me`, {
            headers: { Authorization: "Bearer " + store.token },
          });

          if (resp.ok) {
            const data = await resp.json();
            setStore({ user: data });
          }
        } catch (err) {
          console.error("Error cargando usuario:", err);
        }
      },

      // ============================
      // SINCRONIZAR TOKEN
      // ============================
      syncTokenFromSessionStore: async () => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        setStore({ token });

        const actions = getActions();
        await actions.getCurrentUser();
      },

      // ============================
      // LOGOUT
      // ============================
      logout: () => {
        sessionStorage.removeItem("token");
        setStore({ token: null, user: null });
      },
    },
  };
};

export default getState;

const getState = ({ getStore, getActions, setStore }) => {
  const API_URL = process.env.BACKEND_URL || "http://localhost:3001";

  return {
    store: {
      token: sessionStorage.getItem("token") || null,
      user: null,
    },

    actions: {
      // LOGIN REAL
      login: async (email, password) => {
        try {
          const resp = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!resp.ok) throw new Error("Credenciales incorrectas");

          const data = await resp.json(); // { token, user }

          sessionStorage.setItem("token", data.token);

          setStore({
            token: data.token,
            user: data.user || null,
          });

          return true;
        } catch (err) {
          console.error("Error en login:", err);
          return false;
        }
      },

      // REGISTER REAL
      register: async (form) => {
        try {
          const resp = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });

          if (!resp.ok) throw new Error("Error en registro");

          return true;
        } catch (err) {
          console.error("Error en register:", err);
          return false;
        }
      },

      // CARGAR TOKEN DESDE SESSION STORAGE
      syncTokenFromSessionStore: async () => {
        const token = sessionStorage.getItem("token");

        if (token) {
          setStore({ token: token });
          await getActions().getUserData();
        }
      },

      // OBTENER DATOS DEL USUARIO LOGUEADO
      getUserData: async () => {
        const store = getStore();

        if (!store.token) return;

        try {
          const resp = await fetch(`${API_URL}/api/auth/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${store.token}`,
            },
          });

          if (!resp.ok) throw new Error("Token inválido");

          const data = await resp.json(); // user info

          setStore({ user: data });
        } catch (err) {
          console.error("Error cargando usuario:", err);
          sessionStorage.removeItem("token");
          setStore({ token: null, user: null });
        }
      },

      // LOGOUT REAL
      logout: () => {
        sessionStorage.removeItem("token");
        setStore({
          token: null,
          user: null,
        });
      },
    },
  };
};

export default getState;

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      user: null,
    },

    actions: {
      // LOGIN (dummy por ahora)
      login: async (email, password) => {
        console.log("Login ejecutado:", email, password);

        // Simulación de login correcto
        const fakeToken = "12345";
        const fakeUser = {
          email: email,
          name: "Usuario Demo",
        };

        sessionStorage.setItem("token", fakeToken);

        setStore({
          token: fakeToken,
          user: fakeUser,
        });

        return true;
      },

      // REGISTER (dummy por ahora)
      register: async (form) => {
        console.log("Register ejecutado:", form);
        return true; // simula registro correcto
      },

      // SINCRONIZAR TOKEN DESDE SESSION STORAGE
      syncTokenFromSessionStore: () => {
        const token = sessionStorage.getItem("token");

        if (token && token !== "" && token !== undefined) {
          setStore({ token: token });
        }
      },

      // LOGOUT
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

const getState = ({ getStore, getActions, setStore }) => {
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  return {
    store: {
      pois: [],
      currentPlace: null
    },

    actions: {
      loadPois: async () => {
        try {
          const resp = await fetch(`${API_URL}/api/pois`);
          if (!resp.ok) return;
          const data = await resp.json();

          setStore({
            ...getStore(),
            pois: data
          });
        } catch (error) {
          console.error("Error loading POIs:", error);
        }
      },

      loadPlaceById: async id => {
        try {
          setStore({
            ...getStore(),
            currentPlace: null
          });

          const resp = await fetch(`${API_URL}/api/pois/${id}`);
          if (!resp.ok) return;
          const data = await resp.json();

          setStore({
            ...getStore(),
            currentPlace: data
          });
        } catch (error) {
          console.error("Error loading place:", error);
        }
      }
    }
  };
};

export default getState;

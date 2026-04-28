// src/front/js/store/places.js

const getState = ({ getStore, getActions, setStore, API_URL }) => {
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
          // eslint-disable-next-line no-console
          console.error("Error loading POIs:", error);
        }
      },

      loadPlaceById: async (id) => {
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
          // eslint-disable-next-line no-console
          console.error("Error loading place:", error);
        }
      }
    }
  };
};

export default getState;

// src/front/js/store/appContext.jsx

import React, { useState, useEffect, useRef } from "react";
import getState from "./flux.js";

export const Context = React.createContext(null);

const injectContext = PassedComponent => {
  const StoreWrapper = props => {
    const stateRef = useRef(null);

    const [state, setState] = useState(() => {
      const placeholder = { store: {}, actions: {} };

      const getStore = () => (stateRef.current ? stateRef.current.store : placeholder.store);
      const getActions = () => (stateRef.current ? stateRef.current.actions : placeholder.actions);
      const setStore = updatedStore => {
        setState(prev => {
          const next = {
            store: { ...prev.store, ...updatedStore },
            actions: { ...prev.actions }
          };
          stateRef.current = next;
          return next;
        });
      };

      const initial = getState({ getStore, getActions, setStore });
      stateRef.current = initial;
      return initial;
    });

    useEffect(() => {
      stateRef.current = state;
    }, [state]);

    useEffect(() => {
      const actions = stateRef.current?.actions;
      if (!actions) return;

      if (typeof actions.syncTokenFromSessionStore === "function") {
        try {
          actions.syncTokenFromSessionStore();
        } catch (err) {}
      }

      if (typeof actions.loadSavedRoutesLocal === "function") {
        try {
          actions.loadSavedRoutesLocal();
        } catch (err) {}
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Context.Provider value={state}>
        <PassedComponent {...props} />
      </Context.Provider>
    );
  };

  return StoreWrapper;
};

export default injectContext;

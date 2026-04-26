import React, { useState, useEffect } from "react";
import getState from "./flux.js";

export const Context = React.createContext(null);

const StoreWrapper = ({ children }) => {

    const [state, setState] = useState(() => {
        let initialState = {};

        initialState = getState({
            getStore: () => initialState.store,
            getActions: () => initialState.actions,
            setStore: updatedStore =>
                setState(prevState => ({
                    store: { ...prevState.store, ...updatedStore },
                    actions: { ...prevState.actions }
                }))
        });

        return initialState;
    });

    // ❗ FIX: evitar bucle infinito
    useEffect(() => {
        if (state.actions && state.actions.syncTokenFromSessionStore) {
            state.actions.syncTokenFromSessionStore();
        }
    }, []); // ← SOLO UNA VEZ

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    );
};

export default StoreWrapper;

import React, { useState, useEffect } from "react";
import getState from "./flux.js";

export const Context = React.createContext(null);

const StoreWrapper = ({ children }) => {
    // Inicialización correcta SIN usar state antes de existir
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

    // Cargar token si existe
    useEffect(() => {
        if (state.actions && state.actions.syncTokenFromSessionStore) {
            state.actions.syncTokenFromSessionStore();
        }
    }, [state.actions]);

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    );
};

export default StoreWrapper;

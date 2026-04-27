import React, { useState, useEffect } from "react";
import getState from "./flux.js";

export const Context = React.createContext(null);

const StoreWrapper = ({ children }) => {
    const [state, setState] = useState(null);

    useEffect(() => {
        const initialState = getState({
            getStore: () => initialState.store,
            getActions: () => initialState.actions,
            setStore: updatedStore =>
                setState(prev => ({
                    store: { ...prev.store, ...updatedStore },
                    actions: { ...prev.actions }
                }))
        });

        // Cargar token desde localStorage ANTES de montar el store
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token) initialState.store.token = token;
        if (user) initialState.store.user = JSON.parse(user);

        setState(initialState);
    }, []);

    if (!state) return null;

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    );
};

export default StoreWrapper;

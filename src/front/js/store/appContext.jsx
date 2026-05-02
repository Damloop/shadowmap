// src/front/js/store/appContext.jsx

import React, { useState, useEffect } from "react";
import getState from "./flux.js";

export const Context = React.createContext(null);

const injectContext = PassedComponent => {
    const StoreWrapper = props => {
        const [state, setState] = useState(() => {
            const initialState = getState({
                getStore: () => initialState.store,
                getActions: () => initialState.actions,
                setStore: updatedStore =>
                    setState(prev => ({
                        store: { ...prev.store, ...updatedStore },
                        actions: { ...prev.actions }
                    }))
            });
            return initialState;
        });

        useEffect(() => {
            state.actions.syncToken?.();
            state.actions.loadSavedRoutesLocal?.();
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

import { useState } from "react";

export default function usePersistedState(key, initialState) {
    const [state, setState] = useState(() => {
        try {
            const persisted = localStorage.getItem(key);
            if (!persisted) {
                return typeof initialState === 'function' ? initialState() : initialState;
            }
            return JSON.parse(persisted);
        } catch (error) {
            console.error('Error loading persisted state:', error);
            return typeof initialState === 'function' ? initialState() : initialState;
        }
    });

    const updateState = (value) => {
        const newState = typeof value === 'function' ? value(state) : value;

        if (newState === null || newState === undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(newState));
        }

        setState(newState);
    };

    return [state, updateState];
}

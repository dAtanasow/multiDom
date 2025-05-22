import { useState } from "react";

export default function usePersistedState(key, initialState) {
    const [state, setState] = useState(() => {
        try {
            const persisted = localStorage.getItem(key);
            if (persisted) return JSON.parse(persisted);
        } catch (err) {
            console.error("Persisted state error:", err);
        }
        return typeof initialState === "function" ? initialState() : initialState;
    });

    const updateState = (value) => {
        const newState = typeof value === "function" ? value(state) : value;

        const isEmpty = newState === null || newState === undefined;

        if (isEmpty) {
            localStorage.removeItem(key);
            setState(typeof initialState === "function" ? initialState() : initialState);
            return;
        }

        localStorage.setItem(key, JSON.stringify(newState));
        setState(newState);
    };

    return [state, updateState];
}
import usePersistedState from "../hooks/usePersistedState";
import { createContext, useContext } from "react";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

function AuthProvider({ children }) {
    const [authState, setAuthState] = usePersistedState("auth", {
        user: null,
        accessToken: null,
    });

    const changeAuthState = (newState) => {
        if (newState === null) {
            setAuthState(null);
            return;
        }

        if (typeof newState !== "object") return;

        setAuthState((prev) => ({ ...prev, ...newState }));
    };

    const logout = () => {
        const token = authState?.accessToken;

        setAuthState({ user: null, accessToken: null });

        fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            credentials: "include",
            headers: {
                "Authorization": token ? `Bearer ${token}` : ""
            }
        }).catch((err) => console.error("Logout API error:", err));
    };

    const contextData = {
        userId: authState?.user?._id || null,
        email: authState?.user?.email || null,
        firstName: authState?.user?.firstName || null,
        lastName: authState?.user?.lastName || null,
        phone: authState?.user?.phone || null,
        accessToken: authState ? authState.accessToken : null,
        isAuthenticate: !!authState?.user,
        role: authState?.user?.role || 'user',
        changeAuthState,
        logout,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
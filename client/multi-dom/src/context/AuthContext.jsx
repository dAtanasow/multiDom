import usePersistedState from "../hooks/usePersistedState";
import { createContext, useContext, useEffect } from "react";

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
        setAuthState({ user: null, accessToken: null });
    
        fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        }).catch((err) => console.error("Logout API error:", err));
    
        window.location.href = "/";
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
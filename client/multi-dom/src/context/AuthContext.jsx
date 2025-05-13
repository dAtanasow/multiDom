import usePersistedState from "../hooks/usePersistedState";
import { createContext, useContext, useState } from "react";
import { getAccessToken } from "../utils/authUtil";
import { useNavigate } from "react-router";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

function AuthProvider({ children }) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [authState, setAuthState] = usePersistedState("auth", {
        user: null,
        accessToken: null,
    });

    const navigate = useNavigate();

    const changeAuthState = (newState) => {
        if (newState === null) {
            setAuthState(null);
            return;
        }

        if (typeof newState !== "object") return;

        setAuthState((prev) => ({ ...prev, ...newState }));
    };

    const logout = async () => {
        const token = getAccessToken();
        if (!token) {
            console.warn("Missing access token during logout");
            return;
        }
    
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await fetch("http://localhost:3000/api/auth/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            localStorage.removeItem("cart");

            setAuthState({ user: null, accessToken: null });
            navigate("/login");
        } catch (err) {
            console.error("Logout API error:", err);
        } finally {
            setIsLoggingOut(false);
        }
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
        isLoggingOut,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
import usePersistedState from "../hooks/usePersistedState";
import { createContext, useContext, useState } from "react";
import { getAccessToken } from "../utils/authUtil";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import userApi from "../api/auth";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

function AuthProvider({ children }) {
    const [isUserLoaded, setIsUserLoaded] = useState(false);
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

        setAuthState(prev => ({ ...prev, ...newState }));
    }

    useEffect(() => {
        const checkUser = async () => {
            try {
                const userData = await userApi.getCurrentUser();
                setAuthState(prev => ({ ...prev, user: userData }));
            } catch (err) {
                const current = JSON.parse(localStorage.getItem("auth") || "{}");
                if (current?.accessToken) {
                    console.warn(err);
                } else {
                    setAuthState(prev => ({ ...prev, user: null }));
                }
            } finally {
                setIsUserLoaded(true);
            }
        };

        checkUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const logout = async () => {
        const token = getAccessToken();
        if (!token) {
            console.warn("Missing access token during logout");
            return;
        }

        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
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
        isUserLoaded,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
import { useState } from "react";
import { toast } from "react-toastify";
import userApi from "../api/auth";
import { useAuthContext } from "../context/AuthContext";
import { clearAuth } from "../utils/authUtil";
import { useNavigate } from "react-router";

export function useRegister() {
    const [loading, setLoading] = useState(false);

    const register = async (registerData) => {
        setLoading(true);
        try {
            const result = await userApi.register(registerData);
            toast.success("Успешна регистрация!");
            return result;
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(error.message || "Грешка при регистрация.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { register, loading };
}

export function useLogin() {
    const [loading, setLoading] = useState(false);
    const { changeAuthState } = useAuthContext();

    const login = async (loginData) => {
        setLoading(true);
        try {
            const result = await userApi.login(loginData);
            const { user, accessToken } = result;

            changeAuthState({
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                },
                accessToken: accessToken,
            });

            toast.success("Успешен вход!");
            return result;
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.message || "Грешка при вход.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading };
}

export function useLogout() {
    const navigate = useNavigate();

    const { logout: localLogout, accessToken } = useAuthContext()
    const logoutHandler = async () => {
        if (!accessToken) {
            console.log("No active session detected.");
            localLogout();
            navigate("/");
            return;
        }
        try {
            await userApi.logout();
            toast.success("Успешно излязохте.");
        } catch (err) {
            console.error("Logout API error:", err);
            toast.error("Проблем при излизане.");
        } finally {
            clearAuth();
            navigate("/");
        }
    };

    return logoutHandler;
}
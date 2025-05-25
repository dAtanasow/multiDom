import { useState } from "react";
import { toast } from "react-toastify";
import userApi from "../api/auth";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { setAccessToken } from "../utils/authUtil";
import { useCartContext } from "../context/CartContext";
import { syncLocalCartToServer } from "../utils/cartSync";

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
    const { setCart, syncedRef } = useCartContext();

    const login = async (loginData) => {
        setLoading(true);
        try {
            const result = await userApi.login(loginData);
            const { user, accessToken } = result;
            setAccessToken(accessToken);
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
            await syncLocalCartToServer(setCart, syncedRef);
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
    const { logout, isLoggingOut } = useAuthContext();
    const { clearCart } = useCartContext();

    const logoutHandler = async () => {
        if (isLoggingOut) return;

        try {
            clearCart({ localOnly: true });
            await logout();
            toast.success("Успешно излязохте от профила.");
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Logout error:", err);
            toast.error("Грешка при излизане.");
        }
    };

    return { logout: logoutHandler, isLoggingOut };
}

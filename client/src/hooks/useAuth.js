import { useState } from "react";
// import { toast } from "react-toastify";
import { toast } from "sonner";
import userApi from "../api/auth";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { setAccessToken } from "../utils/authUtil";
import { useCartContext } from "../context/CartContext";
import { syncLocalCartToServer } from "../utils/cartSync";
import { isValidEmail } from "../utils/validators";

export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { changeAuthState } = useAuthContext();

    const register = async (formData, onClose) => {
        setErrors({});
        setLoading(true);

        try {
            const result = await userApi.register(formData);
            toast.success("Успешна регистрация!");
            changeAuthState({
                user: result.user,
                accessToken: result.accessToken,
            });
            onClose?.();
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Грешка при регистрация.";
            toast.error(msg);
            setErrors({ global: msg });
        } finally {
            setLoading(false);
        }
    };

    return { register, loading, errors };
}

export function useLogin() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { changeAuthState } = useAuthContext();
    const { setCart, syncedRef } = useCartContext();

    const login = async (data) => {
        const validation = {};
        if (!data.email) {
            validation.email = "Имейлът е задължителен.";
        } else if (!isValidEmail(data.email)) {
            validation.email = "Невалиден имейл адрес.";
        }

        if (!data.password) {
            validation.password = "Паролата е задължителна.";
        }

        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }

        setErrors({});
        setLoading(true);
        try {
            const result = await userApi.login(data);
            const { user, accessToken } = result;
            setAccessToken(accessToken);
            changeAuthState({ user, accessToken });
            await syncLocalCartToServer(setCart, syncedRef);
            toast.success("Успешен вход!");
            return result;
        } catch (error) {
            toast.error(error.message || "Грешка при вход.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, errors };
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

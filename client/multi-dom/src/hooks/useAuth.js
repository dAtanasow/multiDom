import { useState } from "react";
import userApi from "../api/user";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";

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

            changeAuthState({ user, accessToken });
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

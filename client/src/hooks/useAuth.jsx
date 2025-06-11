import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
import { toast } from "sonner";
import userApi from "../api/auth";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { setAccessToken } from "../utils/authUtil";
import { useCartContext } from "../context/CartContext";
import { isValidEmail } from "../utils/validators";
import { syncLocalCartToServer } from "../utils/cartSync";
import cartApi from "../api/cart";

export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    // const { changeAuthState } = useAuthContext(); // можеш да го оставиш за после

    const register = async (formData, onClose) => {
        setErrors({});
        setLoading(true);

        try {
            await userApi.register(formData);
            toast.success("Успешна регистрация! Потвърди имейла си.");
            onClose?.();
            navigate("/check-email");
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
    const { setCart } = useCartContext();

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
            await new Promise(resolve => setTimeout(resolve, 100));
            await syncLocalCartToServer();
            localStorage.removeItem("cart");
            const serverCart = await cartApi.getCart();
            setCart(serverCart.items || []);
            toast.success("Успешен вход!");
            return result;
        } catch (error) {
            console.log(error);
            let code = null;
            let msg = "Грешка при вход.";

            if (error.response?.data) {
                code = error.response.data.code;
                msg = error.response.data.message || msg;
            } else if (error.message) {
                msg = error.message;
            }

            if (code === "EMAIL_NOT_CONFIRMED") {
                toast.custom((t) => (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg w-[320px] overflow-visible shadow-lg text-sm">
                        <p className="font-semibold mb-2">Имейлът не е потвърден</p>
                        <p className="text-xs mb-3">Провери пощата си или изпрати ново потвърждение.</p>

                        <button
                            onClick={async () => {
                                try {
                                    await userApi.resendConfirmation(data.email);
                                    toast.success("Изпратихме нов имейл за потвърждение.");
                                } catch (err) {
                                    toast.error(err.response?.data?.message || "Грешка при изпращане.");
                                } finally {
                                    toast.dismiss(t);
                                }
                            }}
                            className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                        >
                            Изпрати отново
                        </button>
                    </div>
                ), {
                    duration: 5000,
                });
                return null;
            }

            toast.error(msg);
            setErrors({ global: msg });
            throw error;

        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        const handleMessage = async (event) => {
            if (event.origin !== window.origin) return;
            if (event.data?.type === "EMAIL_CONFIRMED" && event.data.accessToken) {
                try {
                    setAccessToken(event.data.accessToken);
                    const user = await userApi.getCurrentUser();
                    changeAuthState({ user, accessToken: event.data.accessToken });
                    toast.success("Имейлът беше потвърден успешно!");
                } catch (err) {
                    console.error("Грешка при EMAIL_CONFIRMED:", err);
                }
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

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

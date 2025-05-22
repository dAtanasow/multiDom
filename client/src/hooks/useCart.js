import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import cartApi from "../api/cart";

export default function useCartSync(setCart) {
    const { userId, isAuthenticate } = useAuthContext();

    useEffect(() => {
        const loadCart = async () => {
            try {
                if (!isAuthenticate) {
                    setCart([]);
                    return;
                }

                const data = await cartApi.getCart();
                setCart(data?.items || []);
            } catch (err) {
                console.error("Грешка при зареждане на количката:", err);
            }
        };

        loadCart();
    }, [userId, isAuthenticate]);
}

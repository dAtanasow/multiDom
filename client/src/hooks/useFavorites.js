import { useState, useEffect } from "react";
import profileApi from "../api/profile";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";

export default function useFavorites() {
    const { favorites: initialFavorites, changeAuthState } = useAuthContext();
    const [favorites, setFavorites] = useState(initialFavorites || []);
    const [loading, setLoading] = useState(false);

    const isFavorite = (productId) => favorites.includes(productId);

    const toggleFavorite = async (productId) => {
        try {
            setLoading(true);
            const res = await profileApi.toggleFavorite(productId);
            setFavorites(res.favorites);
            changeAuthState((prev) => ({
                ...prev,
                user: { ...prev.user, favorites: res.favorites },
            }));
            toast.success(res.favorites.includes(productId)
                ? "Добавено в любими"
                : "Премахнато от любими");
        } catch (err) {
            toast.error("Грешка при обработка на любими");
        } finally {
            setLoading(false);
        }
    };

    return {
        favorites,
        isFavorite,
        toggleFavorite,
        loading,
    };
}
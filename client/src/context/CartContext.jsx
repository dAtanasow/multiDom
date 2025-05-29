import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuthContext } from "./AuthContext";
import cartApi from "../api/cart";
import { syncLocalCartToServer } from "../utils/cartSync";

const CartContext = createContext();
export const useCartContext = () => useContext(CartContext);

function CartProvider({ children }) {
    const [updatingId, setUpdatingId] = useState(null);
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });
    const { isAuthenticate, userId, isUserLoaded } = useAuthContext();
    const syncedRef = useRef({ userId: null, synced: false });
    const syncedUserRef = useRef(null);

    const uniqueById = (items) => {
        const map = new Map();
        for (const item of items) {
            map.set(item._id, item);
        }
        return Array.from(map.values());
    };

    useEffect(() => {
        const syncAndLoadCart = async () => {
            if (!isAuthenticate || !userId || !isUserLoaded) return;
            if (syncedUserRef.current === userId) return;

            try {
                await syncLocalCartToServer(setCart);
                syncedUserRef.current = userId;
            } catch (err) {
                console.error("Грешка при sync/load:", err);
            }
        };

        syncAndLoadCart();
    }, [isAuthenticate, userId, isUserLoaded]);

    const addToCartContext = async (product) => {
        if (!product || !product._id || typeof product.price !== "number") return;
        if (isAuthenticate) {
            try {
                await cartApi.addToCart(product._id, 1);
                setCart(prev => {
                    const found = prev.find(i => i._id === product._id);
                    const updated = found
                        ? prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i)
                        : [...prev, { ...product, quantity: 1 }];
                    return uniqueById(updated);
                });
            } catch (err) {
                console.error("[addToCartContext] Server error:", err);
            }
        } else {
            setCart(prev => {
                const found = prev.find(i => i._id === product._id);
                const updated = found
                    ? prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i)
                    : [...prev, { ...product, quantity: 1 }];
                const deduped = uniqueById(updated);
                localStorage.setItem("cart", JSON.stringify(deduped));
                return deduped;
            });
        }
    };

    const removeFromCart = async (productId) => {
        const updated = cart.filter((item) => item._id !== productId);
        const deduped = uniqueById(updated);
        setCart(deduped);

        if (isAuthenticate) {
            try {
                await cartApi.removeFromCart(productId);
            } catch (err) {
                console.error("[removeFromCart] Server error:", err);
            }
        } else {
            localStorage.setItem("cart", JSON.stringify(deduped));
        }
    };

    const updateQuantity = async (productId, quantity) => {
        const newQuantity = Math.max(1, quantity);
        const updated = cart.map((item) =>
            item._id === productId ? { ...item, quantity: newQuantity } : item
        );
        const deduped = uniqueById(updated);
        setCart(deduped);

        if (isAuthenticate) {
            setUpdatingId(productId);
            try {
                await cartApi.updateCart({
                    items: deduped.map(({ _id, quantity }) => ({
                        product: _id,
                        quantity,
                    })),
                });
            } catch (err) {
                console.error("[updateQuantity] Server update failed:", err);
            } finally {
                setUpdatingId(null);
            }
        } else {
            localStorage.setItem("cart", JSON.stringify(deduped));
        }
    };

    const clearCart = (options = { localOnly: false }) => {
        setCart([]);
        localStorage.removeItem("cart");
        if (!options.localOnly && isAuthenticate) {
            cartApi.clearCart().catch(console.error);
        }
    };

    return (
        <CartContext.Provider
            value={{ cart, addToCartContext, removeFromCart, updateQuantity, clearCart, syncedRef, updatingId, setCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;

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
    const { isAuthenticate, userId, isUserLoaded, accessToken } = useAuthContext();
    const syncedRef = useRef({ userId: null, synced: false });
    const syncedUserRef = useRef(null);

    useEffect(() => {
        const loadCart = async () => {
            try {
                const cartData = await cartApi.getCart();
                setCart(Array.isArray(cartData) ? cartData : cartData.items || []);
            } catch (err) {
                console.error("Грешка при зареждане на количката:", err);
            }
        };

        if (isUserLoaded && isAuthenticate && accessToken) {
            loadCart();
        }
    }, [isUserLoaded, isAuthenticate, accessToken]);

    useEffect(() => {
        const syncAndLoadCart = async () => {
            if (!isAuthenticate || !userId || !isUserLoaded) return;
            if (syncedUserRef.current === userId) return;

            try {
                await syncLocalCartToServer();
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
                        ? prev.map(i =>
                            i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i)
                        : [...prev, { ...product, quantity: 1 }];
                    return updated;
                });
            } catch (err) {
                console.error("[addToCartContext] Server error:", err);
            }
        } else {
            setCart(prev => {
                const found = prev.find(i => i._id === product._id);
                const updated = found
                    ? prev.map(i =>
                        i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i)
                    : [...prev, { ...product, quantity: 1 }];
                localStorage.setItem("cart", JSON.stringify(updated));
                return updated;
            });
        }
    };

    const removeFromCart = async (productId) => {
        const updated = cart.filter((item) => item._id !== productId);
        setCart(updated);

        if (isAuthenticate) {
            try {
                await cartApi.removeFromCart(productId);
            } catch (err) {
                console.error("[removeFromCart] Server error:", err);
            }
        } else {
            localStorage.setItem("cart", JSON.stringify(updated));
        }
    };

    const updateQuantity = async (productId, quantity) => {
        const newQuantity = Math.max(1, quantity);

        const updated = cart.map((item) =>
            item._id === productId
                ? { ...item, quantity: newQuantity }
                : item
        );

        setCart(updated);

        if (isAuthenticate) {
            setUpdatingId(productId);
            try {
                await cartApi.updateCart({
                    items: updated.map(({ _id, quantity }) => ({
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
            localStorage.setItem("cart", JSON.stringify(updated));
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

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuthContext } from "./AuthContext";
import cartApi from "../api/cart";
import { syncLocalCartToServer } from "../utils/cartSync";

const CartContext = createContext();
export const useCartContext = () => useContext(CartContext);

function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [updatingId, setUpdatingId] = useState(null);
    const { isAuthenticate, userId, isUserLoaded } = useAuthContext();
    const hasSyncedRef = useRef(false);
    const syncedUserRef = useRef(false)

    const uniqueById = (items) => {
        const map = new Map();
        for (const item of items) {
            map.set(item._id, item);
        }
        return Array.from(map.values());
    };

    const loadCart = useCallback(async () => {
        try {
            if (isAuthenticate && userId && isUserLoaded) {
                if (!hasSyncedRef.current) {
                    await syncLocalCartToServer();
                    localStorage.removeItem("cart");
                    hasSyncedRef.current = true;
                }

                const serverCart = await cartApi.getCart();
                setCart(uniqueById(serverCart.items || []));
            } else {
                const local = localStorage.getItem("cart");
                if (local) {
                    const parsed = JSON.parse(local);
                    setCart(parsed);
                }
            }
        } catch (err) {
            console.error("[CartProvider] Грешка при зареждане на количката:", err);
        }
    }, [isAuthenticate, userId, isUserLoaded]);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    useEffect(() => {
        if (!isAuthenticate) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, isAuthenticate]);

    useEffect(() => {
        if (isAuthenticate && isUserLoaded && userId && syncedUserRef.current !== userId) {
            syncedUserRef.current = userId;

            (async () => {
                try {
                    await syncLocalCartToServer();
                    localStorage.removeItem("cart");
                } catch (err) {
                    console.error("[CartProvider] Sync error:", err);
                }

                const serverCart = await cartApi.getCart();
                setCart(uniqueById(serverCart.items || []));
            })();
        }
    }, [isAuthenticate, isUserLoaded, userId]);


    const addToCartContext = async (product) => {
        if (!product || !product._id || typeof product.price !== "number") return;

        if (isAuthenticate) {
            try {
                const existing = cart.find(i => i._id === product._id);
                if (existing) {
                    await updateQuantity(product._id, existing.quantity + 1);
                } else {
                    const response = await cartApi.addToCart(product._id, 1);
                    if (response?.items) {
                        setCart(uniqueById(response.items));
                    } else {
                        await loadCart();
                    }
                }
                return;
            } catch (err) {
                console.error("[addToCartContext] Server error:", err);
            }
        }

        setCart(prev => {
            const found = prev.find(i => i._id === product._id);
            const updated = found
                ? prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i)
                : [...prev, { ...product, quantity: 1 }];
            const deduped = uniqueById(updated);
            localStorage.setItem("cart", JSON.stringify(deduped));
            return deduped;
        });
    };

    const removeFromCart = async (productId) => {
        setCart(prev => {
            const updated = prev.filter(i => i._id !== productId);
            if (!isAuthenticate) {
                localStorage.setItem("cart", JSON.stringify(updated));
            }
            return updated;
        });

        if (isAuthenticate) {
            try {
                await cartApi.removeFromCart(productId);
            } catch (err) {
                console.error("[removeFromCart] Server error:", err);
            }
        }
    };

    const updateQuantity = async (productId, quantity) => {
        const newQuantity = Math.max(1, quantity);

        let newCart = [];

        setCart(prev => {
            const updated = prev.map(item =>
                item._id === productId ? { ...item, quantity: newQuantity } : item
            );
            const deduped = uniqueById(updated);
            newCart = deduped;
            if (!isAuthenticate) {
                localStorage.setItem("cart", JSON.stringify(deduped));
            }
            return deduped;
        });

        if (isAuthenticate) {
            try {
                setUpdatingId(productId);
                await cartApi.updateCart({
                    items: newCart.map(({ _id, quantity }) => ({ product: _id, quantity }))
                });
            } catch (err) {
                console.error("[updateQuantity] Server update failed:", err);
            } finally {
                setUpdatingId(null);
            }
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
        <CartContext.Provider value={{ cart, setCart, addToCartContext, removeFromCart, updateQuantity, clearCart, updatingId }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;

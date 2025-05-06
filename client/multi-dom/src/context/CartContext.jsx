import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuthContext } from "./AuthContext";
import cartApi from "../api/cart";

const CartContext = createContext();
export const useCartContext = () => useContext(CartContext);

function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const { isAuthenticate } = useAuthContext();
    const syncedRef = useRef(false);

    // --- Синхронизация на количката от localStorage към сървъра ---
    useEffect(() => {
        const syncLocalCartToServer = async () => {
            if (!isAuthenticate || syncedRef.current) return;

            const localCartRaw = localStorage.getItem("cart");
            if (!localCartRaw) return;

            const items = JSON.parse(localCartRaw);
            const validItems = items.filter(
                (item) => item?._id && typeof item.price === "number" && item.name
            );

            if (validItems.length === 0) {
                localStorage.removeItem("cart");
                return;
            }

            try {
                const serverCart = await cartApi.getCart();

                const serverProductIds = new Set(
                    (serverCart?.items || [])
                        .filter(item => item.product && item.product._id)
                        .map(item => item.product._id.toString())
                );

                for (const item of validItems) {
                    const existing = serverCart?.items?.find(serverItem =>
                        serverItem.product && serverItem.product._id === item._id
                    );

                    if (!existing) {
                        await cartApi.addToCart(item._id, item.quantity);
                    } else {
                        const diff = item.quantity - existing.quantity;
                        if (diff > 0) {
                            await cartApi.addToCart(item._id, diff);
                        }
                    }
                }

                const updatedCart = await cartApi.getCart();

                const formatted = (updatedCart?.items || [])
                    .filter(item => item.product && item.product._id)
                    .map(item => ({
                        _id: item.product._id,
                        name: item.product.name,
                        price: item.product.price,
                        images: item.product.images,
                        quantity: item.quantity,
                    }));

                setCart(formatted);

                localStorage.removeItem("cart");
                syncedRef.current = true;
            } catch (err) {
                console.error("[SYNC] Error syncing cart:", err);
            }
        };

        syncLocalCartToServer();
    }, [isAuthenticate]);

    // --- При неаутентикиран потребител четем от localStorage ---
    useEffect(() => {
        if (isAuthenticate) return;
        const saved = localStorage.getItem("cart");
        setCart(saved ? JSON.parse(saved) : []);
    }, [isAuthenticate]);

    // --- При логнат потребител четем от сървъра ---
    useEffect(() => {
        const loadCart = async () => {
            if (!isAuthenticate) return;
            try {
                const rawCart = await cartApi.getCart();

                const formatted = (rawCart?.items || [])
                    .filter(item => item.product && item.product._id) // филтрирай невалидни
                    .map(item => ({
                        _id: item.product._id,
                        name: item.product.name,
                        price: item.product.price,
                        images: item.product.images,
                        quantity: item.quantity,
                    }));

                setCart(formatted);
            } catch (err) {
                console.error("Грешка при зареждане на количката от сървъра:", err);
            }
        };
        loadCart();
    }, [isAuthenticate]);

    // --- Съхраняване в localStorage при анонимни ---
    useEffect(() => {
        if (!isAuthenticate) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, isAuthenticate]);

    const addToCart = async (product) => {
        console.log("[addToCart] Called with:", product);
        if (!product || !product._id || typeof product.price !== "number") return;

        setCart((prev) => {
            const existing = prev.find((item) => item._id === product._id);
            return existing
                ? prev.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
                : [...prev, { ...product, quantity: 1 }];
        });

        if (isAuthenticate) {
            try {
                await cartApi.addToCart(product._id, 1);
            } catch (err) {
                console.error("[addToCart] Error sending to server:", err);
            }
        }
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        setCart((prev) => {
            const updated = prev.map((item) =>
                item._id === productId
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            );

            if (isAuthenticate) {
                cartApi.updateCart({
                    items: updated.map(({ _id, quantity }) => ({
                        product: _id,
                        quantity
                    }))
                }).catch((err) => {
                    console.error("[updateQuantity] Server update failed:", err);
                });
            }

            return updated;
        });
    };


    const clearCart = () => {
        setCart([]);
        if (isAuthenticate) {
            cartApi.clearCart().catch((err) => {
                console.error("[clearCart] Server error:", err);
            });
        }
    };

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;
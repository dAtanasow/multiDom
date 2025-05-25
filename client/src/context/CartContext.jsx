import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuthContext } from "./AuthContext";
import cartApi from "../api/cart";
import formatCartItems from "../utils/formatCartItems";
import { syncLocalCartToServer } from "../utils/cartSync";

const CartContext = createContext();
export const useCartContext = () => useContext(CartContext);

function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });
    const { isAuthenticate } = useAuthContext();
    const syncedRef = useRef(false);

    useEffect(() => {
        const loadCart = async () => {
            if (!isAuthenticate) return;
            try {
                const rawCart = await cartApi.getCart();
                setCart(formatCartItems(rawCart?.items || []));
            } catch (err) {
                console.error("Грешка при зареждане на количката от сървъра:", err);
            }
        };
        loadCart();
    }, [isAuthenticate]);

    useEffect(() => {
        if (isAuthenticate && !syncedRef.current) {
            syncLocalCartToServer(setCart);
            syncedRef.current = true;
        }
    }, [isAuthenticate]);

    const addToCartContext = async (product) => {
        if (!product || !product._id || typeof product.price !== "number") return;

        if (isAuthenticate) {
            try {
                await cartApi.addToCart(product._id, 1);
                const updatedCart = await cartApi.getCart();
                setCart(formatCartItems(updatedCart.items));
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

    const updateQuantity = (productId, quantity) => {
        const updated = cart.map((item) =>
            item._id === productId
                ? { ...item, quantity: Math.max(1, quantity) }
                : item
        );
        setCart(updated);

        if (isAuthenticate) {
            cartApi
                .updateCart({
                    items: updated.map(({ _id, quantity }) => ({
                        product: _id,
                        quantity,
                    })),
                })
                .catch((err) => {
                    console.error("[updateQuantity] Server update failed:", err);
                });
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
            value={{ cart, addToCartContext, removeFromCart, updateQuantity, clearCart, syncedRef, setCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;

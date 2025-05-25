import cartApi from "../api/cart";
import formatCartItems from "./formatCartItems";

export async function syncLocalCartToServer(setCart) {
    const localCartRaw = localStorage.getItem("cart");
    if (!localCartRaw) return;

    const items = JSON.parse(localCartRaw);
    const validItems = items.filter(item => item?._id && typeof item.price === "number" && item.name);
    if (validItems.length === 0) {
        localStorage.removeItem("cart");
        return;
    }

    try {
        const serverCart = await cartApi.getCart();
        const serverItemMap = new Map(
            (serverCart?.items || [])
                .filter(item => item.product && item.product._id)
                .map(item => [item.product._id.toString(), item.quantity])
        );

        for (const item of validItems) {
            const serverQuantity = serverItemMap.get(item._id.toString());
            if (serverQuantity === undefined) {
                await cartApi.addToCart(item._id, item.quantity);
            } else {
                const diff = item.quantity - serverQuantity;
                if (diff > 0) {
                    await cartApi.addToCart(item._id, diff);
                }
            }
        }

        const updatedCart = await cartApi.getCart();
        const formatted = formatCartItems(updatedCart.items)
        setCart(formatted);
        localStorage.removeItem("cart");
    } catch (err) {
        console.error("[SYNC] Error syncing cart:", err);
    }
}

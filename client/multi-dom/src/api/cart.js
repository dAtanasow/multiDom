import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL + "/cart";

const getCart = () => requester.get(baseUrl);

const updateCart = (data) => requester.put(baseUrl, data);

const deleteCartItem = (productId) =>
    requester.delete(`${baseUrl}/${productId}`);

const clearCart = () => requester.delete(baseUrl);

const cartApi = {
    getCart,
    updateCart,
    deleteCartItem,
    clearCart,
};

export default cartApi;

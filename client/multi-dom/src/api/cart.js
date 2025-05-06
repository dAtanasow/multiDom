import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL + "/cart";

const getCart = () => requester.get(baseUrl);

const updateCart = (data) => requester.put(baseUrl, data);

const deleteCartItem = (productId) =>
    requester.del(`${baseUrl}/${productId}`);

const clearCart = () => requester.del(baseUrl);

const addToCart = (productId, quantity = 1) =>
    requester.post(`${baseUrl}/add`, { productId, quantity });

const cartApi = {
    getCart,
    updateCart,
    deleteCartItem,
    clearCart,
    addToCart,
};

export default cartApi;

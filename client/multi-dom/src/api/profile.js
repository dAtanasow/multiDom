import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL + "/profile";

const getAddresses = () => requester.get(`${baseUrl}/addresses`);

const addAddress = (data) => requester.post(`${baseUrl}/addresses`, data);

const deleteAddress = (index) => requester.del(`${baseUrl}/addresses/${index}`);

const updateUser = (data) => {
    return requester.put(`${baseUrl}/edit`, data);
}

const toggleFavorite = (productId) => {
    return requester.post(`${baseUrl}/favorites/toggle`, { productId });
};

const profileApi = {
    getAddresses,
    addAddress,
    deleteAddress,
    updateUser,
    toggleFavorite
};

export default profileApi;
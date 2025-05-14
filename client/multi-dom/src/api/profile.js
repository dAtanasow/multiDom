import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL + "/profile";

const getAddresses = () => requester.get(`${baseUrl}/addresses`);

const addAddress = (data) => requester.post(`${baseUrl}/addresses`, data);

const deleteAddress = (index) => requester.del(`${baseUrl}/addresses/${index}`);

const updateUser = (data) => {
    return requester.put(baseUrl, data);
}

const profileApi = {
    getAddresses,
    addAddress,
    deleteAddress,
    updateUser
};

export default profileApi;
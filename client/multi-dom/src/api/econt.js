import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL + "/econt";

const getByCity = (city) => {
    const query = city ? `?city=${encodeURIComponent(city)}` : "";
    return requester.get(`${baseUrl}${query}`);
};

const getById = (id) => requester.get(`${baseUrl}/${id}`);

const econtApi = {
    getByCity,
    getById,
};

export default econtApi;

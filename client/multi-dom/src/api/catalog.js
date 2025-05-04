import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL + '/catalog';

const getAll = (query = "") => requester.get(`${baseUrl}${query ? `?${query}` : ""}`);

const getById = (id) => requester.get(`${baseUrl}/${id}`);



const productApi = {
    getAll,
    getById,
};

export default productApi;

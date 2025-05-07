import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL + '/catalog';

const getAll = (query = "") => requester.get(`${baseUrl}${query ? `?${query}` : ""}`);

const getById = (id) => requester.get(`${baseUrl}/${id}`);

const getNewest = () => getAll("sortBy=createdAt&order=desc");

const catalogApi = {
    getAll,
    getById,
    getNewest,
};

export default catalogApi;

import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL + '/catalog';

const getAll = (query = "") => requester.get(`${baseUrl}${query ? `?${query}` : ""}`);

const getById = (id) => requester.get(`${baseUrl}/${id}`);

<<<<<<< HEAD
const getNewest = (limit) => getAll(`sortBy=createdAt&order=desc&${limit}`);
=======
const getNewest = () => getAll("sortBy=createdAt&order=desc");
>>>>>>> dd2fe17fb7ab855f0ea0d16927f2ffcf9d6c24c9

const catalogApi = {
    getAll,
    getById,
    getNewest,
};

export default catalogApi;

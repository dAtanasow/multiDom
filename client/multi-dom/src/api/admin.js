import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL + '/admin';

const create = (data) => requester.post(baseUrl, data);

const update = (id, data) => requester.put(`${baseUrl}/${id}`, data);

const remove = (id) => requester.del(`${baseUrl}/${id}`);

const adminApi = {
    create,
    update,
    remove,
}

export default adminApi;

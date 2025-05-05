import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL + '/admin';

const createProduct = (data) => requester.post(`${baseUrl}/create`, data);

const deleteProduct = (id) => requester.del(`${baseUrl}/delete/${id}`);

const updateProduct = (id, data) => requester.put(`${baseUrl}/update/${id}`, data);


const adminApi = {
    createProduct,
    updateProduct,
    deleteProduct,
}

export default adminApi;

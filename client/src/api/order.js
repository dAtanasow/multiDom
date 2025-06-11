import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL + "/order";

const createOrder = (data) => {
    return requester.post(`${baseUrl}`, data);
};

const getOrderById = (id) => {
    return requester.get(`${baseUrl}/${id}`);
};

const getAllOrders = () => {
    return requester.get(baseUrl);
};

const updateOrderStatus = (id, status) => {
    return requester.put(`${baseUrl}/${id}/status`, { status });
};

const getUserOrders = () => requester.get(`${baseUrl}/user`);

const orderApi = {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    getUserOrders,
};

export default orderApi;

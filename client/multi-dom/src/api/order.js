import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL + '/thank-you';

const createOrder = (data) => {
    return requester.post(baseUrl, data);
}

const orderApi = {
    createOrder,
};

export default orderApi;

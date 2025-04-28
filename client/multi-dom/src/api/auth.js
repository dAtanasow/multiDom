import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL + '/auth';

const register = (data) => {
    return requester.post(`${baseUrl}/register`, data);
}

const login = (data) => {
    return requester.post(`${baseUrl}/login`, data);
}
const getUser = () => {
    return requester.get(`${baseUrl}/profile`);
}

const update = (data) => {
    return requester.put(`${baseUrl}/profile`, data);
}

const logout = () => requester.post(`${baseUrl}/logout`);

const userApi = {
    register,
    login,
    getUser,
    update,
    logout
};

export default userApi;
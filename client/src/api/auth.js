import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL + '/auth';

const register = (data) => {
    return requester.post(`${baseUrl}/register`, data);
}

const login = (data) => {
    return requester.post(`${baseUrl}/login`, data);
}

const logout = () => requester.post(`${baseUrl}/logout`);

const getCurrentUser = () => {
    return requester.get(`${baseUrl}/me`);
}
const userApi = {
    register,
    login,
    logout,
    getCurrentUser
};

export default userApi;
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

const confirmEmail = (token) => {
    return requester.get(`${baseUrl}/confirm-email?token=${token}`, null, { skipAuth: true });
}

const resendConfirmation = (email) => {
    return requester.post(`${baseUrl}/resend-confirmation`, { email });
};

const userApi = {
    register,
    login,
    logout,
    getCurrentUser,
    confirmEmail,
    resendConfirmation
};

export default userApi;
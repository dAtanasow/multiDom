export const getAccessToken = () => {
    const authData = localStorage.getItem('auth');
    if (authData) {
        const parsedData = JSON.parse(authData);
        return parsedData.accessToken;
    }
    return null;
};
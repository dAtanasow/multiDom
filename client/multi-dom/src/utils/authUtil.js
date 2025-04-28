export const getAccessToken = () => {
    const authData = localStorage.getItem('auth');
    if (authData) {
        const parsedData = JSON.parse(authData);
        return parsedData.accessToken;
    }
    return null;
};

export function setAccessToken(accessToken) {
    const authData = JSON.stringify({ accessToken });
    localStorage.setItem('auth', authData);
}

export function clearAuth() {
    localStorage.removeItem('auth');
}
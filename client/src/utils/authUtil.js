export const getAccessToken = () => {
    const authData = localStorage.getItem('auth');
    if (authData) {
        try {
            const parsedData = JSON.parse(authData);
            return parsedData.accessToken || null;
        } catch (err) {
            console.error("Грешка при парсване на токена:", err);
            return null;
        }
    }
    return null;
};

export function setAccessToken(newAccessToken) {
    const authData = localStorage.getItem('auth');
    let parsed = {};

    try {
        parsed = authData ? JSON.parse(authData) : {};
    } catch (err) {
        console.warn('Невалиден JSON в localStorage:', err);
    }

    const updatedData = {
        ...parsed,
        accessToken: newAccessToken,
    };

    localStorage.setItem('auth', JSON.stringify(updatedData));
}

export function clearAuth() {
    localStorage.removeItem('auth');
};


export const onUnauthorized = () => {
    const event = new CustomEvent("unauthorized");
    window.dispatchEvent(event);
};